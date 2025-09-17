from pymongo import MongoClient
from app.core.config import settings

# MongoDB connection
client = MongoClient(settings.MONGODB_URL)
db = client.emailagent

# Collections
users_collection = db.users