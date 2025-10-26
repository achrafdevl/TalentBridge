# app/routes/certification_routes.py
from fastapi import APIRouter, HTTPException, Depends
from ..models.cvProfile import Certification, CertificationInDB
from ..database import certifications_collection
from ..auth.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/certifications", tags=["Certifications"])

@router.post("/", response_model=CertificationInDB, status_code=201)
async def create_certification(cert: Certification, current_user: dict = Depends(get_current_user)):
    cert_data = cert.dict()
    cert_data["user_id"] = str(current_user["_id"])
    result = await certifications_collection.insert_one(cert_data)
    
    # Convert MongoDB _id to id string
    cert_data["id"] = str(result.inserted_id)
    return CertificationInDB(**cert_data)

@router.get("/", response_model=list[CertificationInDB])
async def get_certifications(current_user: dict = Depends(get_current_user)):
    certs = await certifications_collection.find({"user_id": str(current_user["_id"])}).to_list(None)
    # Convert _id to id for each certification
    return [CertificationInDB(
        id=str(cert["_id"]),
        user_id=cert["user_id"],
        **{k: v for k, v in cert.items() if k not in ["_id", "user_id"]}
    ) for cert in certs]

@router.put("/{cert_id}", response_model=CertificationInDB)
async def update_certification(cert_id: str, cert: Certification, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(cert_id):
        raise HTTPException(status_code=400, detail="Invalid certification ID")

    updated = await certifications_collection.find_one_and_update(
        {"_id": ObjectId(cert_id), "user_id": str(current_user["_id"])},
        {"$set": cert.dict()},
        return_document=True
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Certification not found")

    # Convert _id to id
    updated["id"] = str(updated.pop("_id"))
    return CertificationInDB(**updated)

@router.delete("/{cert_id}")
async def delete_certification(cert_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(cert_id):
        raise HTTPException(status_code=400, detail="Invalid certification ID")

    result = await certifications_collection.delete_one(
        {"_id": ObjectId(cert_id), "user_id": str(current_user["_id"])}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Certification not found")

    return {"message": "Certification deleted"}
