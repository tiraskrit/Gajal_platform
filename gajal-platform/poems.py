import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import mongo

poems_bp = Blueprint('poems_bp', __name__)

# Submit a Poem
@poems_bp.route('/api/submitPoem', methods=['POST'])
@jwt_required()
def submit_poem():
    data = request.get_json()
    title = data['title']
    content = data['content']
    author_id = get_jwt_identity()

    poem = {
        "title": title,
        "content": content,
        "author": author_id,
        "status": "pending",  # Status pending for admin review
        "created_at": datetime.utcnow()
    }
    mongo.db.poems.insert_one(poem)
    return jsonify({"message": "Poem submitted successfully", "status": "pending"}), 201

# Fetch All Approved Poems
@poems_bp.route('/api/poems', methods=['GET'])
def get_poems():
    poems = list(mongo.db.poems.find({"status": "approved"}))
    return jsonify(poems), 200
