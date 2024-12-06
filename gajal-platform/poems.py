from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import mongo

poems_bp = Blueprint('poems_bp', __name__)

@poems_bp.route('/api/submitPoem', methods=['POST'])
@jwt_required()
def submit_poem():
    data = request.get_json()
    title = data['title']
    content = data['content']
    content_type = data.get('content_type', 'Poem')  # Get content_type with default
    author_id = get_jwt_identity()

    poem = {
        "title": title,
        "content": content,
        "content_type": content_type,
        "author": author_id,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    
    result = mongo.db.poems.insert_one(poem)
    return jsonify({"message": "Content submitted successfully", "status": "pending"}), 201

@poems_bp.route('/api/poems', methods=['GET'])
def get_poems():
    poems = list(mongo.db.poems.find({"status": "approved"}))
    for poem in poems:
        poem['_id'] = str(poem['_id'])  # Convert ObjectId to string
    return jsonify(poems), 200