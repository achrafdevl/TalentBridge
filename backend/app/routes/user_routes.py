from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from ..models.user import UserResponse, UserUpdate
from ..database import users_collection
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

# Get current user info
@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

# Get any user by ID
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(**user)

# Update current user profile
@router.put("/profile", response_model=UserResponse)
async def update_profile(user_update: UserUpdate, current_user: dict = Depends(get_current_user)):
    update_data = user_update.dict(exclude_unset=True)
    if update_data:
        await users_collection.update_one({"_id": current_user["_id"]}, {"$set": update_data})
    updated_user = await users_collection.find_one({"_id": current_user["_id"]})
    return UserResponse(**updated_user)
