"""
CV Routes: Handle CV upload, creation from profile, and retrieval.

This module provides endpoints for managing CV documents,
including text extraction and named entity recognition.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pathlib import Path
from datetime import datetime, UTC
from bson import ObjectId
import logging

from app.database import cvs_collection
from app.services.cv_profile_service import cv_profile_to_text
from app.auth.dependencies import get_current_user
from app.utils.extract_text import extract_text_from_file
from app.services.ner_service import extract_entities_safe

router = APIRouter(prefix="/cv", tags=["CV"])
logger = logging.getLogger(__name__)

# Upload directory for CV files
UPLOAD_DIR = Path("uploaded_cvs")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload")
async def upload_cv(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)) -> dict:
    """Upload CV file and extract text content"""
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    save_path = UPLOAD_DIR / file.filename
    try:
        content = await file.read()
        save_path.write_bytes(content)
        cv_text = extract_text_from_file(save_path)
    except Exception as e:
        logger.error(f"Failed to process CV: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    # Extract entities using NER (LLM) - safe mode doesn't fail on errors
    logger.info(f"Extracting entities from CV: {file.filename}")
    entities = extract_entities_safe(cv_text)

    cv_document = {
        "filename": file.filename,
        "file_path": str(save_path),
        "raw_text": cv_text,
        "entities": entities,  # Store extracted entities
        "upload_date": datetime.now(UTC),
        "user_id": str(current_user["_id"])
    }

    result = await cvs_collection.insert_one(cv_document)
    cv_id = str(result.inserted_id)

    return {
        "cv_id": cv_id,
        "filename": file.filename,
        "raw_text_preview": cv_text[:500] + "..." if len(cv_text) > 500 else cv_text
    }

@router.post("/from-profile")
async def create_cv_from_profile(current_user: dict = Depends(get_current_user)) -> dict:
    """Create a CV document from user's CV profile"""
    user_id = str(current_user["_id"])
    try:
        cv_text = await cv_profile_to_text(user_id)
    except ValueError as e:
        logger.error(f"CV profile not found: {e}")
        raise HTTPException(
            status_code=404,
            detail=f"CV profile not found. Please create your CV profile first. {str(e)}"
        )
    except Exception as e:
        logger.error(f"Failed to create CV from profile: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create CV from profile. Error: {str(e)}"
        )

    # Extract entities using NER (LLM) - safe mode doesn't fail on errors
    logger.info(f"Extracting entities from CV profile for user: {user_id}")
    entities = extract_entities_safe(cv_text)

    cv_document = {
        "filename": f"profile_cv_{user_id[:8]}.txt",
        "file_path": None,
        "raw_text": cv_text,
        "entities": entities,  # Store extracted entities
        "upload_date": datetime.now(UTC),
        "from_profile": True,
        "user_id": user_id
    }

    result = await cvs_collection.insert_one(cv_document)
    cv_id = str(result.inserted_id)

    return {
        "cv_id": cv_id,
        "filename": "CV depuis profil",
        "raw_text_preview": cv_text[:500] + "..." if len(cv_text) > 500 else cv_text
    }

@router.get("/{cv_id}")
async def get_cv(cv_id: str, current_user: dict = Depends(get_current_user)) -> dict:
    """Retrieve CV by ID (only owner can access)"""
    try:
        cv = await cvs_collection.find_one({"_id": ObjectId(cv_id)})
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")
        if str(cv.get("user_id")) != str(current_user["_id"]):
            raise HTTPException(status_code=403, detail="Forbidden: You do not own this CV")
        cv["_id"] = str(cv["_id"])
        return cv
    except Exception as e:
        logger.error(f"Failed to get CV: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid CV ID: {str(e)}")
