import os
from dotenv import load_dotenv

load_dotenv()

# Get API key from environment variable
SECRET_KEY = os.environ.get('SECRET_KEY')
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
MONGO_URI = os.environ.get('MONGO_URI')