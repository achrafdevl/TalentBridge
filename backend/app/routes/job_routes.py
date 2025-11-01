from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pathlib import Path
from datetime import datetime
from bson import ObjectId
from app.database import jobs_collection
from app.utils.extract_text import extract_text_from_file
import logging

router = APIRouter(prefix="/job", tags=["Job"])

UPLOAD_DIR = Path("uploaded_jobs")
UPLOAD_DIR.mkdir(exist_ok=True)

logger = logging.getLogger(__name__)

@router.post("/upload")
async def upload_job(
    title: str = Form(None),
    description: str = Form(None),
    file: UploadFile = File(None),
    text: str = Form(None)
):
    try:
        logger.info(f"Job upload request - title: {title}, has_file: {file is not None}, has_text: {text is not None}")
        
        text_content = ""
        filename = "text_input.txt"
        
        # --- Step 1: If file provided, save and extract text ---
        if file and file.filename:
            try:
                filename = file.filename
                # Sanitize filename to prevent path traversal
                safe_filename = Path(filename).name
                file_path = UPLOAD_DIR / safe_filename
                
                # Read file content
                file_content = await file.read()
                if not file_content:
                    raise HTTPException(status_code=400, detail="Uploaded file is empty")
                
                # Save file
                with open(file_path, "wb") as f:
                    f.write(file_content)
                
                # Extract text
                text_content = extract_text_from_file(file_path)
                logger.info(f"Extracted {len(text_content)} characters from file {filename}")
                
            except HTTPException:
                raise
            except Exception as e:
                logger.error(f"Error processing file {filename}: {str(e)}", exc_info=True)
                raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
                
        elif text:
            # Use provided text directly
            text_content = text.strip()
            if not text_content:
                raise HTTPException(status_code=400, detail="Text input cannot be empty")
            logger.info(f"Using provided text ({len(text_content)} characters)")
        else:
            raise HTTPException(status_code=400, detail="Either file or text must be provided")

        if not text_content:
            raise HTTPException(status_code=400, detail="No text content available to save")

        # --- Step 2: Save data to MongoDB ---
        # Store both 'text' and 'job_text' for compatibility
        job_data = {
            "title": title or "Untitled",
            "description": description or "",
            "filename": filename,
            "text": text_content,
            "job_text": text_content,  # Also store as job_text for compatibility
            "created_at": datetime.utcnow()
        }

        try:
            result = await jobs_collection.insert_one(job_data)
            job_id = str(result.inserted_id)
            logger.info(f"Job saved successfully with ID: {job_id}")
            
            return {
                "message": "Job uploaded successfully",
                "job_id": job_id,
                "file_name": filename
            }
        except Exception as e:
            logger.error(f"Database error: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Failed to save job to database: {str(e)}")

    except HTTPException as e:
        # Custom extraction-related errors
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in upload_job: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing job: {str(e)}")
