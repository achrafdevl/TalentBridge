from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from ..models.user import UserResponse, UserUpdate
from ..database import users_collection
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

# Get current user info
@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    # Convert _id to id and remove password_hash
    user_id = str(current_user["_id"]) if "_id" in current_user else current_user.get("id")
    current_user.pop("password_hash", None)
    
    # Create user response dict
    user_response = {
        "id": user_id,
        "full_name": current_user.get("full_name", ""),
        "email": current_user.get("email", ""),
        "bio": current_user.get("bio"),
        "location": current_user.get("location"),
        "profile_image": current_user.get("profile_image"),
        "social_links": current_user.get("social_links"),
    }
    
    return UserResponse(**user_response)

# Get any user by ID
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Convert _id to id and remove password_hash
    user_id_str = str(user["_id"])
    user.pop("password_hash", None)
    
    # Create user response dict
    user_response = {
        "id": user_id_str,
        "full_name": user.get("full_name", ""),
        "email": user.get("email", ""),
        "bio": user.get("bio"),
        "location": user.get("location"),
        "profile_image": user.get("profile_image"),
        "social_links": user.get("social_links"),
    }
    
    return UserResponse(**user_response)

# Update current user profile
@router.put("/profile", response_model=UserResponse)
async def update_profile(user_update: UserUpdate, current_user: dict = Depends(get_current_user)):
    update_data = user_update.dict(exclude_unset=True)
    if update_data:
        await users_collection.update_one({"_id": current_user["_id"]}, {"$set": update_data})
    updated_user = await users_collection.find_one({"_id": current_user["_id"]})
    
    # Convert _id to id and remove password_hash
    user_id_str = str(updated_user["_id"])
    updated_user.pop("password_hash", None)
    
    # Create user response dict
    user_response = {
        "id": user_id_str,
        "full_name": updated_user.get("full_name", ""),
        "email": updated_user.get("email", ""),
        "bio": updated_user.get("bio"),
        "location": updated_user.get("location"),
        "profile_image": updated_user.get("profile_image"),
        "social_links": updated_user.get("social_links"),
    }
    
    return UserResponse(**user_response)
