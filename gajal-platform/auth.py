# auth.py
from flask import Blueprint, request, jsonify, url_for
from werkzeug.security import check_password_hash, generate_password_hash
from extensions import mongo
from flask_jwt_extended import create_access_token
import secrets
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from email_service import EmailService


auth_bp = Blueprint('auth_bp', __name__)
email_service = EmailService()

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    remember_me = data.get('rememberMe', False)

    user = mongo.db.users.find_one({"email": email})

    if user and check_password_hash(user["password"], password):
        # Set token expiration based on remember me
        if remember_me:
            expires_delta = timedelta(days=30)
        else:
            expires_delta = timedelta(days=1)
        
        # Include is_verified status in the token
        access_token = create_access_token(
            identity=user['email'],
            additional_claims={
                "role": user['role'],
                "is_verified": user.get('is_verified', False)  # Get is_verified status with False as default
            },
            expires_delta=expires_delta
        )
        
        # Return verification status in response for immediate UI feedback
        return jsonify({
            "access_token": access_token,
            "is_verified": user.get('is_verified', False)
        }), 200

    return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    user = mongo.db.users.find_one({"email": email})
    if not user:
        return jsonify({"message": "If your email exists, you will receive reset instructions"}), 200
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(hours=24)
    
    # Store reset token in database
    mongo.db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "reset_token": reset_token,
                "reset_token_expires": expiry
            }
        }
    )
    
    # Send password reset email
    if email_service.send_reset_password_email(email, reset_token):
        return jsonify({"message": "Password reset instructions have been sent to your email"}), 200
    else:
        return jsonify({"error": "Failed to send reset email. Please try again later"}), 500


@auth_bp.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')
    
    if not token or not new_password:
        return jsonify({"error": "Missing token or password"}), 400
    
    user = mongo.db.users.find_one({
        "reset_token": token,
        "reset_token_expires": {"$gt": datetime.utcnow()}
    })
    
    if not user:
        return jsonify({"error": "Invalid or expired reset token"}), 400
    
    # Update password and remove reset token
    hashed_password = generate_password_hash(new_password)
    mongo.db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"password": hashed_password},
            "$unset": {"reset_token": "", "reset_token_expires": ""}
        }
    )
    
    return jsonify({"message": "Password updated successfully"}), 200

@auth_bp.route('/api/signUp', methods=['POST'])
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']
    role = data.get('role', 'user')

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    # Generate verification token
    verification_token = secrets.token_urlsafe(32)
    token_expiry = datetime.utcnow() + timedelta(hours=24)

    # Create user with verification token
    hashed_password = generate_password_hash(password)
    mongo.db.users.insert_one({
        "email": email,
        "password": hashed_password,
        "role": role,
        "is_verified": False,
        "verification_token": verification_token,
        "verification_token_expires": token_expiry
    })

    # Send verification email
    if email_service.send_verification_email(email, verification_token):
        return jsonify({
            "message": "User created successfully. Please check your email to verify your account."
        }), 201
    else:
        return jsonify({
            "message": "User created successfully, but verification email could not be sent. Please contact support."
        }), 201
    
@auth_bp.route('/api/verify-email', methods=['POST'])
def verify_email():
    token = request.json.get('token')
    
    if not token:
        return jsonify({"error": "Verification token is required"}), 400

    user = mongo.db.users.find_one({
        "verification_token": token,
        "verification_token_expires": {"$gt": datetime.utcnow()},
        "is_verified": False
    })

    if not user:
        return jsonify({"error": "Invalid or expired verification token"}), 400

    # Update user verification status
    mongo.db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"is_verified": True},
            "$unset": {
                "verification_token": "",
                "verification_token_expires": ""
            }
        }
    )

    return jsonify({"message": "Email verified successfully"}), 200