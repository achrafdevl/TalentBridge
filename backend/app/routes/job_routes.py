from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pathlib import Path
from bson import ObjectId
import pdfplumber
from docx import Document
from app.database import jobs_collection

router = APIRouter(prefix="/job", tags=["Job"])

UPLOAD_DIR = Path("uploaded_jobs")
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
async def upload_job(
    title: str = Form(None),
    text: str = Form(None),
    file: UploadFile = File(None)
):
    """Upload job offer via file or text"""
    job_text = text or ""
    filename = None
    
    if file:
        if not file.filename.endswith(('.pdf', '.docx', '.txt')):
            raise HTTPException(status_code=400, detail="Only PDF, DOCX, and TXT files are supported")
        
        filename = file.filename
        file_path = UPLOAD_DIR / filename
        
        # Save file
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Extract text
        try:
            if file.filename.endswith('.txt'):
                job_text = content.decode('utf-8')
            else:
                job_text = extract_text_from_file(file_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")
    
    if not job_text:
        raise HTTPException(status_code=400, detail="Job text or file is required")
    
    # Save to MongoDB
    job_document = {
        "title": title,
        "filename": filename,
        "job_text": job_text,
        "upload_date": None  # Add datetime if needed
    }
    
    result = await jobs_collection.insert_one(job_document)
    job_id = str(result.inserted_id)
    
    return {
        "job_id": job_id,
        "title": title,
        "filename": filename,
        "job_text": job_text[:500] + "..." if len(job_text) > 500 else job_text
    }

@router.get("/{job_id}")
async def get_job(job_id: str):
    """Retrieve job by ID"""
    try:
        job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        job["_id"] = str(job["_id"])
        return job
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid job ID: {str(e)}")
