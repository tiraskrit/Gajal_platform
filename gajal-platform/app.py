from datetime import datetime, timezone
from flask import Flask, jsonify, request, make_response
from extensions import mongo, jwt  # Import extensions
import config
from auth import auth_bp  # Import the authentication blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS
from functools import wraps
from bson import ObjectId 


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

# Handle preflight requests for all routes
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS")
        return response

# Add a default route for testing
@app.route('/')
def index():
    return "Welcome to the Sahitya Platform API!"

# Route to get approved poems
@app.route('/api/poems', methods=['GET'])
@jwt_required()
def get_poems():
    # Retrieve only approved poems
    poems = mongo.db.poems.find({"status": "approved"})
    
    # Format poems for response
    poem_list = [{"id": str(poem["_id"]),
                  "title": poem["title"], 
                  "content": poem["content"], 
                  "author": poem["author"], 
                  "author_id": poem["author_id"], 
                  "content_type": poem["content_type"], 
                  "liked_by": poem["liked_by"],
                  "likes": poem["likes"] } for poem in poems]
    
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
    content_type = data.get('content_type')
    author_id = get_jwt_identity()  # Author ID comes from JWT token; it should be the user's email
    status = "pending"  # Default status for new submissions

    # Validate the title and content
    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400
    
    # Retrieve the user's first name and last name from the database
    user = mongo.db.users.find_one({"email": author_id})
    first_name = user.get('first_name', 'Unknown')
    last_name = user.get('last_name', 'Unknown')

    # Insert the content with status as "pending" for admin approval
    mongo.db.poems.insert_one({
        "title": title,
        "content": content,
        "content_type":content_type,
        "author": f"{first_name}, {last_name}",
        "author_id": author_id,  # Using the author's email from JWT
        "status": status,          # Status for new poems
        "created_at": datetime.now(timezone.utc),
        "likes":0,
        "liked_by":[]
    })

    return jsonify({"message": "Content submitted successfully. Awaiting approval."}), 201

@app.route('/api/poems/<poem_id>/like', methods=['POST'])
@jwt_required()
def like_poem(poem_id):
    user_id = get_jwt_identity()
    poem = mongo.db.poems.find_one({"_id": ObjectId(poem_id)})

    if not poem:
        return jsonify({"error": "Poem not found"}), 404

    # Check if the user has already liked the poem
    if user_id in poem.get("liked_by", []):
        # Unlike the poem
        mongo.db.poems.update_one(
            {"_id": ObjectId(poem_id)},
            {"$inc": {"likes": -1}, "$pull": {"liked_by": user_id}}
        )
        return jsonify({"message": "Poem unliked"}), 200
    else:
        # Like the poem
        mongo.db.poems.update_one(
            {"_id": ObjectId(poem_id)},
            {"$inc": {"likes": 1}, "$push": {"liked_by": user_id}}
        )
        return jsonify({"message": "Poem liked"}), 200

@app.route('/api/poems/<poem_id>', methods=['DELETE'])
@jwt_required()
def delete_poem(poem_id):
    user_id = get_jwt_identity()
    poem = mongo.db.poems.find_one({"_id": ObjectId(poem_id)})

    if not poem:
        return jsonify({"error": "Poem not found"}), 404

    # Check if the user is the author of the poem
    if poem.get("author_id") != user_id:
        return jsonify({"error": "You are not authorized to delete this poem"}), 403

    # Delete the poem
    result = mongo.db.poems.delete_one({"_id": ObjectId(poem_id)})

    if result.deleted_count > 0:
        response = jsonify({"message": "Poem deleted successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")  # Add CORS header
        return response, 200
    else:
        response = jsonify({"error": "Failed to delete poem"})
        response.headers.add("Access-Control-Allow-Origin", "*")  # Add CORS header
        return response, 500

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
    return jsonify([{"_id": str(poem["_id"]), "title": poem["title"], "content": poem["content"], "content_type": poem["content_type"]} for poem in pending_poems]), 200

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
        return jsonify({"message": f"Content {action}d successfully"}), 200
    else:
        return jsonify({"error": "Content not found or already reviewed"}), 404

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({
        "status": "alive",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }), 200

if __name__ == '__main__':
    app.run()