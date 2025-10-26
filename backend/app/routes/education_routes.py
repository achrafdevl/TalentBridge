# app/routes/education_routes.py
from fastapi import APIRouter, HTTPException, Depends
from ..models.cvProfile import Education, EducationInDB
from ..database import educations_collection
from ..auth.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/education", tags=["Education"])

@router.post("/", response_model=EducationInDB, status_code=201)
async def create_education(edu: Education, current_user: dict = Depends(get_current_user)):
    edu_data = edu.dict()
    edu_data["user_id"] = str(current_user["_id"])
    result = await educations_collection.insert_one(edu_data)
    
    # Convert MongoDB _id to id string
    edu_data["id"] = str(result.inserted_id)
    return EducationInDB(**edu_data)

@router.get("/", response_model=list[EducationInDB])
async def get_education(current_user: dict = Depends(get_current_user)):
    edus = await educations_collection.find({"user_id": str(current_user["_id"])}).to_list(None)
    # Convert _id to id for each education
    return [EducationInDB(
        id=str(edu["_id"]),
        user_id=edu["user_id"],
        **{k: v for k, v in edu.items() if k not in ["_id", "user_id"]}
    ) for edu in edus]

@router.put("/{edu_id}", response_model=EducationInDB)
async def update_education(edu_id: str, edu: Education, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(edu_id):
        raise HTTPException(status_code=400, detail="Invalid education ID")

    updated = await educations_collection.find_one_and_update(
        {"_id": ObjectId(edu_id), "user_id": str(current_user["_id"])},
        {"$set": edu.dict()},
        return_document=True
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Education not found")

    # Convert _id to id
    updated["id"] = str(updated.pop("_id"))
    return EducationInDB(**updated)

@router.delete("/{edu_id}")
async def delete_education(edu_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(edu_id):
        raise HTTPException(status_code=400, detail="Invalid education ID")

    result = await educations_collection.delete_one(
        {"_id": ObjectId(edu_id), "user_id": str(current_user["_id"])}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Education not found")

    return {"message": "Education deleted"}
