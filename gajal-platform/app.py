from flask import Flask, jsonify, request
from extensions import mongo, jwt  # Import extensions
import config
from auth import auth_bp  # Import the authentication blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS
from functools import wraps
from bson import ObjectId 

from apscheduler.schedulers.background import BackgroundScheduler
import requests


app = Flask(__name__)

# MongoDB configuration
app.config["MONGO_URI"] = config.MONGO_URI
# Enable CORS for all routes and origins
CORS(app)

# Load JWT secret key
app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY

# Initialize extensions with app
mongo.init_app(app)
jwt.init_app(app)

users_collection = mongo.db.users
poems_collection = mongo.db.poems

# Register Blueprints
app.register_blueprint(auth_bp)

# Add a default route for testing
@app.route('/')
def index():
    return "Welcome to the Gajal Platform API!"

# Route to get approved poems
@app.route('/api/poems', methods=['GET'])
@jwt_required()
def get_poems():
    # Retrieve only approved poems
    poems = mongo.db.poems.find({"status": "approved"})
    
    # Format poems for response
    poem_list = [{"title": poem["title"], "content": poem["content"], "author_id": poem["author_id"]} for poem in poems]
    
    return jsonify(poem_list), 200

# Route to submit a new poem
@app.route('/api/submitPoem', methods=['POST', 'OPTIONS'])
@jwt_required()
def submit_poem():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 200

    # Parse the JSON data with forced JSON parsing
    data = request.get_json(force=True)  # force=True ensures JSON parsing

    title = data.get('title')
    content = data.get('content')
    author_id = get_jwt_identity()  # Author ID comes from JWT token; it should be the user's email
    status = "pending"  # Default status for new submissions

    # Validate the title and content
    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    # Insert the poem with status as "pending" for admin approval
    mongo.db.poems.insert_one({
        "title": title,
        "content": content,
        "author_id": author_id,  # Using the author's email from JWT
        "status": status          # Status for new poems
    })

    return jsonify({"message": "Poem submitted successfully. Awaiting approval."}), 201

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        user = users_collection.find_one({"email": identity})
        
        if user and user.get("role") == "admin":
            return fn(*args, **kwargs)
        else:
            return jsonify({"error": "Admin access required"}), 403
    
    return wrapper

@app.route('/api/admin/poems', methods=['GET'])
@jwt_required()
@admin_required
def get_pending_poems():
    pending_poems = poems_collection.find({"status": "pending"})
    return jsonify([{"_id": str(poem["_id"]), "title": poem["title"], "content": poem["content"]} for poem in pending_poems]), 200

@app.route('/api/admin/poems/<poem_id>', methods=['PATCH'])
@jwt_required()
@admin_required
def review_poem(poem_id):
    action = request.json.get("action")
    if action not in ["approve", "reject"]:
        return jsonify({"error": "Invalid action"}), 400
    
    new_status = "approved" if action == "approve" else "rejected"
    result = poems_collection.update_one({"_id": ObjectId(poem_id)}, {"$set": {"status": new_status}})
    
    if result.modified_count > 0:
        return jsonify({"message": f"Poem {action}d successfully"}), 200
    else:
        return jsonify({"error": "Poem not found or already reviewed"}), 404

# Define a lightweight ping endpoint
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "alive"}), 200

def ping_self():
    try:
        response = requests.get("https://gajal.onrender.com/ping", timeout=5)
        if response.status_code == 200:
            print("Ping successful.")
        else:
            print(f"Ping failed with status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Ping error: {e}")


if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(ping_self, 'interval', minutes=10)
    scheduler.start()
    try:
        app.run()
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()