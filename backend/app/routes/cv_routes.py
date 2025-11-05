from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pathlib import Path
from datetime import datetime
from bson import ObjectId
import pdfplumber
from docx import Document
from app.database import cvs_collection
from app.services.cv_profile_service import cv_profile_to_text
from app.auth.dependencies import get_current_user
import logging

router = APIRouter(prefix="/cv", tags=["CV"])
UPLOAD_DIR = Path("uploaded_cvs")
UPLOAD_DIR.mkdir(exist_ok=True)

logger = logging.getLogger(__name__)

def extract_text_from_file(file_path: Path) -> str:
    """Extract text from PDF or DOCX files"""
    ext = file_path.suffix.lower()
    if ext == ".pdf":
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip()
    elif ext == ".docx":
        doc = Document(file_path)
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format (PDF/DOCX only)")

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

    cv_document = {
        "filename": file.filename,
        "file_path": str(save_path),
        "raw_text": cv_text,
        "upload_date": datetime.utcnow(),
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

    cv_document = {
        "filename": f"profile_cv_{user_id[:8]}.txt",
        "file_path": None,
        "raw_text": cv_text,
        "upload_date": datetime.utcnow(),
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
