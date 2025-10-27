# database.py 
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URI)
db = client[settings.MONGO_DB_NAME]

#! Existing collections
users_collection = db.get_collection("users")

#! CV Profile collection (separate from user auth)
cv_profile_collection = db.get_collection("cv_profiles")


#! New collections for CV sections
projects_collection = db.get_collection("projects")
technologies_collection = db.get_collection("technologies")
competences_collection = db.get_collection("competences")  
languages_collection = db.get_collection("languages")
experiences_collection = db.get_collection("experiences")
educations_collection = db.get_collection("educations")
certifications_collection = db.get_collection("certifications")

cvs_collection = db.get_collection("cvs")
jobs_collection = db.get_collection("jobs")
tailored_cvs_collection = db.get_collection("tailored_cvs")