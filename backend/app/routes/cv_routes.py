from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
from bson import ObjectId
import pdfplumber
from docx import Document
from app.database import cvs_collection

router = APIRouter(prefix="/cv", tags=["CV"])

UPLOAD_DIR = Path("uploaded_cvs")
UPLOAD_DIR.mkdir(exist_ok=True)

def extract_text_from_file(file_path: Path) -> str:
    """Extract text from PDF or DOCX files"""
    if file_path.suffix.lower() == ".pdf":
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    elif file_path.suffix.lower() == ".docx":
        doc = Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

@router.post("/upload")
async def upload_cv(file: UploadFile = File(...)):
    """Upload CV file and extract text content"""
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    # Save file
    save_path = UPLOAD_DIR / file.filename
    content = await file.read()
    with open(save_path, "wb") as f:
        f.write(content)
    
    # Extract text
    try:
        cv_text = extract_text_from_file(save_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")
    
    # Save to MongoDB
    cv_document = {
        "filename": file.filename,
        "file_path": str(save_path),
        "raw_text": cv_text,
        "upload_date": None  # Add datetime if needed
    }
    
    result = await cvs_collection.insert_one(cv_document)
    cv_id = str(result.inserted_id)
    
    return {
        "cv_id": cv_id,
        "filename": file.filename,
        "raw_text": cv_text[:500] + "..." if len(cv_text) > 500 else cv_text
    }

@router.get("/{cv_id}")
async def get_cv(cv_id: str):
    """Retrieve CV by ID"""
    try:
        cv = await cvs_collection.find_one({"_id": ObjectId(cv_id)})
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")
        
        cv["_id"] = str(cv["_id"])
        return cv
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CV ID: {str(e)}")
