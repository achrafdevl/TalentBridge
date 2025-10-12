from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime, date

from app.models.experience import ExperienceCreate, ExperienceResponse
from app.database import experiences_collection
from app.auth.jwt_handler import verify_access_token

router = APIRouter(prefix="/experiences", tags=["Experiences"])

# Dependency to get current user
def get_current_user(token: str):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload.get("sub")


# Helper function to convert date to datetime
def convert_date_to_datetime(exp_dict: dict):
    if isinstance(exp_dict.get("start_date"), date):
        exp_dict["start_date"] = datetime.combine(exp_dict["start_date"], datetime.min.time())
    if exp_dict.get("end_date") and isinstance(exp_dict["end_date"], date):
        exp_dict["end_date"] = datetime.combine(exp_dict["end_date"], datetime.min.time())
    return exp_dict


# Create experience
@router.post("/", response_model=ExperienceResponse)
async def create_experience(exp: ExperienceCreate, user_id: str = Depends(get_current_user)):
    exp_dict = exp.dict()
    exp_dict["user_id"] = ObjectId(user_id)
    exp_dict = convert_date_to_datetime(exp_dict)

    new_exp = await experiences_collection.insert_one(exp_dict)
    created_exp = await experiences_collection.find_one({"_id": new_exp.inserted_id})
    return ExperienceResponse(**created_exp)


# Get all experiences
@router.get("/", response_model=List[ExperienceResponse])
async def get_experiences():
    experiences = []
    async for exp in experiences_collection.find():
        experiences.append(ExperienceResponse(**exp))
    return experiences


# Update experience by ID
@router.put("/{exp_id}", response_model=ExperienceResponse)
async def update_experience(exp_id: str, exp: ExperienceCreate, user_id: str = Depends(get_current_user)):
    if not ObjectId.is_valid(exp_id):
        raise HTTPException(status_code=400, detail="Invalid experience ID")
    
    exp_dict = exp.dict()
    exp_dict["user_id"] = ObjectId(user_id)
    exp_dict = convert_date_to_datetime(exp_dict)

    result = await experiences_collection.update_one(
        {"_id": ObjectId(exp_id)}, {"$set": exp_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    updated_exp = await experiences_collection.find_one({"_id": ObjectId(exp_id)})
    return ExperienceResponse(**updated_exp)


# Delete experience by ID
@router.delete("/{exp_id}")
async def delete_experience(exp_id: str, user_id: str = Depends(get_current_user)):
    if not ObjectId.is_valid(exp_id):
        raise HTTPException(status_code=400, detail="Invalid experience ID")
    
    result = await experiences_collection.delete_one({"_id": ObjectId(exp_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    return {"detail": "Experience deleted successfully"}
