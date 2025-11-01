from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.auth.jwt_handler import verify_access_token
from app.database import users_collection
from bson import ObjectId
from typing import Optional
import logging

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token", auto_error=False)

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)):
    
    if not token:
        logger.warning("Authentication attempt without token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in and provide a valid token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = verify_access_token(token)
    if not payload:
        logger.warning(f"Token verification failed - invalid or expired token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token. Please log in again to get a new token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        logger.warning(f"Token payload missing 'sub' field: {payload}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Token now stores user id as string, convert to ObjectId for lookup
    if not ObjectId.is_valid(user_id):
        logger.warning(f"Invalid user ID format from token: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        logger.warning(f"User not found in database for ID: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user  
