from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URI)
db = client[settings.MONGO_DB_NAME]

# Collections
users_collection = db.get_collection("users")
projects_collection = db.get_collection("projects")
experiences_collection = db.get_collection("experiences")
technologies_collection = db.get_collection("technologies")
certifications_collection = db.get_collection("certifications")
contacts_collection = db.get_collection("contacts")
