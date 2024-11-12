from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from extensions import mongo  # Import mongo from extensions, not app
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Fetch user record from MongoDB by email
    user = mongo.db.users.find_one({"email": email})

    print("User found:", user)
    print("Password check:", check_password_hash(user["password"], password))


    # Verify user exists and password matches
    if user and check_password_hash(user["password"], password):
        access_token = create_access_token(identity=user['email'], additional_claims={"role": user['role']})
        return jsonify(access_token=access_token), 200

    return jsonify({"error": "Invalid email or password"}), 401
    
@auth_bp.route('/api/signUp', methods=['POST'])
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']
    password = data['password']

    role = data.get('role', 'user')

    # Check if the email already exists
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create a new user
    mongo.db.users.insert_one({"email": email, "password": hashed_password, "role": role})
    
    return jsonify({"message": "User created successfully"}), 201
