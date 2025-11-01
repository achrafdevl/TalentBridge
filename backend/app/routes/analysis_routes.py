from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import cvs_collection, jobs_collection
from app.services.similarity_service import compute_similarity
from app.services.keyword_service import extract_keywords, find_common_keywords, get_keyword_coverage

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.get("/cv-job/{cv_id}/{job_id}")
async def analyze_cv_job(cv_id: str, job_id: str) -> dict:
    """Analyze similarity between a CV and a Job with keywords and detailed metrics"""
    cv = await cvs_collection.find_one({"_id": ObjectId(cv_id)})
    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})

    if not cv or not job:
        raise HTTPException(status_code=404, detail="CV or Job not found")

    cv_text = cv.get("raw_text", "")
    job_text = job.get("job_text", "") or job.get("text", "")
    
    # Compute semantic similarity
    similarity = compute_similarity(cv_text, job_text)
    
    # Extract keywords
    cv_keywords = extract_keywords(cv_text, max_keywords=20)
    job_keywords = extract_keywords(job_text, max_keywords=20)
    common_keywords = find_common_keywords(cv_keywords, job_keywords)
    keyword_coverage = get_keyword_coverage(cv_keywords, job_keywords)
    
    # Determine match level
    if similarity >= 0.8:
        match_level = "High"
    elif similarity >= 0.65:
        match_level = "Medium"
    elif similarity >= 0.5:
        match_level = "Low"
    else:
        match_level = "Very Low"
    
    return {
        "cv_id": cv_id,
        "job_id": job_id,
        "similarity": similarity,
        "similarity_score": similarity,  # For compatibility
        "match_level": match_level,
        "cv_keywords": cv_keywords,
        "job_keywords": job_keywords,
        "common_keywords": common_keywords,
        "keyword_coverage": keyword_coverage,
        "keyword_match_count": len(common_keywords),
        "total_job_keywords": len(job_keywords)
    }
