import os
from dotenv import load_dotenv

load_dotenv()

# Get API key from environment variable
SECRET_KEY = os.environ.get('SECRET_KEY')
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
MONGO_URI = os.environ.get('MONGO_URI')
# Email Configuration
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = int(os.getenv('SMTP_PORT'))
SMTP_USERNAME = os.getenv('SMTP_USERNAME')
SMTP_PASSWORD = os.environ.get('SENDGRID_API_KEY')  # Using SendGrid API Key as password


SENDGRID_API_KEY=os.environ.get('SENDGRID_API_KEY')
FRONTEND_URL=os.environ.get('FRONTEND_URL')