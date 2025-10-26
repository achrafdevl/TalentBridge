from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user import UserCreate, UserLogin, UserResponse
from app.database import users_collection
from app.utils.security import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Helper function to create login response
async def _login_response(email: str, password: str):
    existing_user = await users_collection.find_one({"email": email})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(password, existing_user.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Convert _id to id and remove password_hash
    user_id = str(existing_user["_id"])
    existing_user.pop("password_hash", None)
    
    # Create user response dict
    user_response = {
        "id": user_id,
        "full_name": existing_user.get("full_name", ""),
        "email": existing_user.get("email", ""),
        "bio": existing_user.get("bio"),
        "location": existing_user.get("location"),
        "profile_image": existing_user.get("profile_image"),
        "social_links": existing_user.get("social_links"),
    }
    
    token = create_access_token({"sub": user_id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse(**user_response)
    }

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.dict()
    user_dict["password_hash"] = hash_password(user_dict.pop("password"))
    new_user = await users_collection.insert_one(user_dict)
    created_user = await users_collection.find_one({"_id": new_user.inserted_id})
    
    # Convert _id to id and remove password_hash
    user_id = str(created_user["_id"])
    created_user.pop("password_hash", None)
    
    # Create user response dict
    user_response = {
        "id": user_id,
        "full_name": created_user.get("full_name", ""),
        "email": created_user.get("email", ""),
        "bio": created_user.get("bio"),
        "location": created_user.get("location"),
        "profile_image": created_user.get("profile_image"),
        "social_links": created_user.get("social_links"),
    }
    
    return UserResponse(**user_response)

@router.post("/login")
async def login_user(user: UserLogin):
    """Login endpoint - uses email/password"""
    return await _login_response(user.email, user.password)

@router.post("/token")
async def login_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible login endpoint for Swagger UI Authorize button.
    username = email, password = password
    """
    return await _login_response(form_data.username, form_data.password)
