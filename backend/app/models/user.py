from pydantic import BaseModel, EmailStr
from typing import Optional, Dict
from .common import MongoBaseModel

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    bio: Optional[str] = None
    location: Optional[str] = None
    profile_image: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(MongoBaseModel, UserBase):
    pass
