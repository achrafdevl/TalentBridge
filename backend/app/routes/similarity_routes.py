from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import cvs_collection, jobs_collection
from app.services.similarity_service import compute_similarity

router = APIRouter(prefix="/similarity", tags=["Similarity"])

@router.get("/test")
async def test_similarity(cv_id: str, job_id: str):
    """Compute and return similarity score"""
    try:
        cv = await cvs_collection.find_one({"_id": ObjectId(cv_id)})
        job = await jobs_collection.find_one({"_id": ObjectId(job_id)})

        if not cv or not job:
            raise HTTPException(status_code=404, detail="CV or Job not found")

        score = compute_similarity(cv.get("raw_text", ""), job.get("job_text", ""))

        return {
            "cv_id": cv_id,
            "job_id": job_id,
            "similarity_score": score,
            "match_quality": (
                "Strong match" if score >= 0.75 else
                "Moderate match" if score >= 0.6 else
                "Weak match"
            )
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
