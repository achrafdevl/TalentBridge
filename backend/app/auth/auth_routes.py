from fastapi import APIRouter, HTTPException, Depends
from app.models.user import UserCreate, UserLogin, UserResponse
from app.database import users_collection
from app.utils.security import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.dict()
    user_dict["password_hash"] = hash_password(user_dict.pop("password"))
    new_user = await users_collection.insert_one(user_dict)
    created_user = await users_collection.find_one({"_id": new_user.inserted_id})
    return UserResponse(**created_user)

@router.post("/login")
async def login_user(user: UserLogin):
    existing_user = await users_collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, existing_user.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": str(existing_user["_id"])})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse(**existing_user)
    }
