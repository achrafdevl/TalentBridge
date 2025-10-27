from fastapi import APIRouter, Form, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from docx import Document
from docx.shared import Pt
from bson import ObjectId
from app.database import cvs_collection, jobs_collection, tailored_cvs_collection
from app.services.ollama_client import generate_tailored_cv
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/generate", tags=["Generate"])

UPLOAD_DIR = Path("generated_cvs")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/")
async def generate_cv(cv_id: str = Form(...), job_id: str = Form(...)):
    """
    Generate a tailored CV using Ollama AI
    """
    try:
        logger.info(f"Received request - CV ID: {cv_id}, Job ID: {job_id}")
        
        # Retrieve CV from MongoDB
        try:
            logger.info(f"Fetching CV with ID: {cv_id}")
            cv = await cvs_collection.find_one({"_id": ObjectId(cv_id)})
            if not cv:
                logger.error(f"CV not found: {cv_id}")
                raise HTTPException(status_code=404, detail="CV not found")
            logger.info(f"CV found: {cv.get('filename', 'unknown')}")
        except Exception as e:
            logger.error(f"Error fetching CV: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Invalid CV ID: {str(e)}")
        
        # Retrieve Job from MongoDB
        try:
            logger.info(f"Fetching Job with ID: {job_id}")
            job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
            if not job:
                logger.error(f"Job not found: {job_id}")
                raise HTTPException(status_code=404, detail="Job not found")
            logger.info(f"Job found: {job.get('title', 'unknown')}")
        except Exception as e:
            logger.error(f"Error fetching Job: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Invalid job ID: {str(e)}")
        
        cv_text = cv.get("raw_text", "")
        job_text = job.get("job_text", "")
        
        logger.info(f"CV text length: {len(cv_text)}, Job text length: {len(job_text)}")
        
        if not cv_text or not job_text:
            logger.error("Empty CV or Job text")
            raise HTTPException(status_code=400, detail="CV or Job text is empty")
        
        # Generate tailored CV using Ollama
        try:
            logger.info("Starting Ollama generation...")
            tailored_content = generate_tailored_cv(cv_text, job_text)
            logger.info(f"Generation successful, content length: {len(tailored_content)}")
        except Exception as e:
            logger.error(f"Ollama generation error: {str(e)}")
            logger.error(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
        
        # Generate unique ID and save to MongoDB
        generated_id = f"tailored_{cv_id[:8]}_{job_id[:8]}"
        logger.info(f"Generated ID: {generated_id}")
        
        tailored_document = {
            "generated_id": generated_id,
            "cv_id": cv_id,
            "job_id": job_id,
            "tailored_text": tailored_content,
        }
        
        try:
            await tailored_cvs_collection.insert_one(tailored_document)
            logger.info("Saved to MongoDB")
        except Exception as e:
            logger.error(f"MongoDB save error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
        # Create DOCX file
        try:
            output_file = UPLOAD_DIR / f"{generated_id}.docx"
            create_formatted_docx(tailored_content, output_file, job.get("title", "Job Position"))
            logger.info(f"DOCX created: {output_file}")
        except Exception as e:
            logger.error(f"DOCX creation error: {str(e)}")
            logger.error(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Document creation failed: {str(e)}")
        
        return {
            "generated_id": generated_id,
            "generated_snippet": tailored_content[:300] + "...",
            "download_url": f"/generate/download/{generated_id}"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def create_formatted_docx(content: str, output_path: Path, job_title: str):
    """Create a formatted DOCX file from tailored CV content"""
    try:
        doc = Document()
        
        # Title
        title = doc.add_heading(f'CV Personnalisé - {job_title}', 0)
        title.alignment = 1  # Center
        
        # Add content with formatting
        for line in content.split('\n'):
            if line.strip():
                if line.startswith('###'):
                    # Level 3 heading
                    doc.add_heading(line.replace('###', '').strip(), level=3)
                elif line.startswith('##'):
                    # Level 2 heading
                    doc.add_heading(line.replace('##', '').strip(), level=2)
                elif line.startswith('#'):
                    # Level 1 heading
                    doc.add_heading(line.replace('#', '').strip(), level=1)
                elif line.startswith('-') or line.startswith('•') or line.startswith('*'):
                    # Bullet point
                    doc.add_paragraph(line.strip('- •*').strip(), style='List Bullet')
                else:
                    # Normal paragraph
                    p = doc.add_paragraph(line)
                    p.style.font.size = Pt(11)
        
        doc.save(output_path)
        logger.info(f"Document saved successfully: {output_path}")
    except Exception as e:
        logger.error(f"Error in create_formatted_docx: {str(e)}")
        raise

@router.get("/download/{generated_id}")
async def download_generated(generated_id: str):
    """Download the generated tailored CV"""
    file_path = UPLOAD_DIR / f"{generated_id}.docx"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Generated CV file not found")
    
    return FileResponse(
        file_path,
        filename=f"CV_Personnalise_{generated_id}.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )

@router.get("/{generated_id}")
async def get_generated_cv(generated_id: str):
    """Retrieve generated CV details"""
    cv = await tailored_cvs_collection.find_one({"generated_id": generated_id})
    if not cv:
        raise HTTPException(status_code=404, detail="Generated CV not found")
    
    cv["_id"] = str(cv["_id"])
    return cv
