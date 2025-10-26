from fastapi import APIRouter, HTTPException, Depends
from ..models.cvProfile import CvProfile, CvProfileInDB, CvProfileUpdate
from ..database import cv_profile_collection
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/cv-profile", tags=["CV Profile"])

# Create or update CV profile
@router.post("/", response_model=CvProfileInDB, status_code=201)
async def create_cv_profile(cv_profile: CvProfile, current_user: dict = Depends(get_current_user)):
    """Create a CV profile for the current user"""
    cv_profile_data = cv_profile.dict()
    cv_profile_data["user_id"] = str(current_user["_id"])
    
    # Check if profile already exists
    existing = await cv_profile_collection.find_one({"user_id": str(current_user["_id"])})
    
    if existing:
        raise HTTPException(status_code=400, detail="CV profile already exists. Use PUT to update.")
    
    result = await cv_profile_collection.insert_one(cv_profile_data)
    cv_profile_data["id"] = str(result.inserted_id)
    
    return CvProfileInDB(**cv_profile_data)

# Get current user's CV profile
@router.get("/", response_model=CvProfileInDB)
async def get_cv_profile(current_user: dict = Depends(get_current_user)):
    """Get the current user's CV profile"""
    cv_profile = await cv_profile_collection.find_one({"user_id": str(current_user["_id"])})
    
    if not cv_profile:
        raise HTTPException(status_code=404, detail="CV profile not found")
    
    cv_profile["id"] = str(cv_profile.pop("_id"))
    return CvProfileInDB(**cv_profile)

# Update CV profile
@router.put("/", response_model=CvProfileInDB)
async def update_cv_profile(cv_profile: CvProfileUpdate, current_user: dict = Depends(get_current_user)):
    """Update the current user's CV profile"""
    update_data = cv_profile.dict(exclude_unset=True)
    
    updated = await cv_profile_collection.find_one_and_update(
        {"user_id": str(current_user["_id"])},
        {"$set": update_data},
        return_document=True
    )
    
    if not updated:
        raise HTTPException(status_code=404, detail="CV profile not found")
    
    updated["id"] = str(updated.pop("_id"))
    return CvProfileInDB(**updated)

# Delete CV profile
@router.delete("/")
async def delete_cv_profile(current_user: dict = Depends(get_current_user)):
    """Delete the current user's CV profile"""
    result = await cv_profile_collection.delete_one({"user_id": str(current_user["_id"])})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="CV profile not found")
    
    return {"message": "CV profile deleted"}
