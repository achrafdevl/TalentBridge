from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List
from bson import ObjectId
from app.models.certification import CertificationCreate, CertificationResponse
from app.database import certifications_collection
from app.auth.jwt_handler import verify_access_token
from datetime import datetime, date

router = APIRouter(prefix="/certifications", tags=["Certifications"])


# Utility function to convert MongoDB ObjectId to string
def serialize_id(doc: dict) -> dict:
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    if "user_id" in doc and isinstance(doc["user_id"], ObjectId):
        doc["user_id"] = str(doc["user_id"])
    return doc


# Dependency: Extract user from JWT token (passed as query parameter)
def get_current_user(token: str = Query(..., description="JWT access token")) -> str:
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")

    return user_id


# Create

@router.post("/", response_model=CertificationResponse)
async def create_certification(
    cert: CertificationCreate,
    user_id: str = Depends(get_current_user)
):
    cert_dict = cert.dict()

    # Convert `date` (issue_date) to `datetime`
    if isinstance(cert_dict.get("issue_date"), date):
        cert_dict["issue_date"] = datetime.combine(cert_dict["issue_date"], datetime.min.time())

    cert_dict["user_id"] = ObjectId(user_id)

    result = await certifications_collection.insert_one(cert_dict)
    created_cert = await certifications_collection.find_one({"_id": result.inserted_id})

    if not created_cert:
        raise HTTPException(status_code=500, detail="Failed to create certification")

    return CertificationResponse(**serialize_id(created_cert))


# Read
@router.get("/", response_model=List[CertificationResponse])
async def get_certifications(user_id: str = Depends(get_current_user)):
    certs = []
    async for cert in certifications_collection.find({"user_id": ObjectId(user_id)}):
        certs.append(CertificationResponse(**serialize_id(cert)))
    return certs


# Update
@router.put("/{certification_id}", response_model=CertificationResponse)
async def update_certification(
    certification_id: str,
    cert_update: CertificationCreate,
    user_id: str = Depends(get_current_user)
):
    if not ObjectId.is_valid(certification_id):
        raise HTTPException(status_code=400, detail="Invalid certification ID")

    update_data = {k: v for k, v in cert_update.dict().items() if v is not None}
    result = await certifications_collection.update_one(
        {"_id": ObjectId(certification_id), "user_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Certification not found or not authorized to update")

    updated_cert = await certifications_collection.find_one({"_id": ObjectId(certification_id)})
    return CertificationResponse(**serialize_id(updated_cert))


# Delete
@router.delete("/{certification_id}")
async def delete_certification(
    certification_id: str,
    user_id: str = Depends(get_current_user)
):
    if not ObjectId.is_valid(certification_id):
        raise HTTPException(status_code=400, detail="Invalid certification ID")

    result = await certifications_collection.delete_one(
        {"_id": ObjectId(certification_id), "user_id": ObjectId(user_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Certification not found or not authorized to delete")

    return {"detail": "Certification deleted successfully"}
