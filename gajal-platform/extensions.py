# extensions.py

from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager

# Create instances of extensions
mongo = PyMongo()
jwt = JWTManager()
