from fastapi import APIRouter, HTTPException, Depends
from ..models.cvProfile import Experience, ExperienceInDB
from ..database import experiences_collection
from ..auth.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/experiences", tags=["Experiences"])

@router.post("/", response_model=ExperienceInDB, status_code=201)
async def create_experience(exp: Experience, current_user: dict = Depends(get_current_user)):
    exp_data = exp.dict()
    exp_data["user_id"] = str(current_user["_id"])
    result = await experiences_collection.insert_one(exp_data)
    
    # Convert MongoDB _id to id string
    exp_data["id"] = str(result.inserted_id)
    return ExperienceInDB(**exp_data)

@router.get("/", response_model=list[ExperienceInDB])
async def get_experiences(current_user: dict = Depends(get_current_user)):
    exps = await experiences_collection.find({"user_id": str(current_user["_id"])}).to_list(None)
    # Convert _id to id for each experience
    return [ExperienceInDB(
        id=str(exp["_id"]),
        user_id=exp["user_id"],
        **{k: v for k, v in exp.items() if k not in ["_id", "user_id"]}
    ) for exp in exps]

@router.put("/{exp_id}", response_model=ExperienceInDB)
async def update_experience(exp_id: str, exp: Experience, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(exp_id):
        raise HTTPException(status_code=400, detail="Invalid experience ID")

    updated = await experiences_collection.find_one_and_update(
        {"_id": ObjectId(exp_id), "user_id": str(current_user["_id"])},
        {"$set": exp.dict()},
        return_document=True
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Experience not found")

    # Convert _id to id
    updated["id"] = str(updated.pop("_id"))
    return ExperienceInDB(**updated)

@router.delete("/{exp_id}")
async def delete_experience(exp_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(exp_id):
        raise HTTPException(status_code=400, detail="Invalid experience ID")

    result = await experiences_collection.delete_one(
        {"_id": ObjectId(exp_id), "user_id": str(current_user["_id"])}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")

    return {"message": "Experience deleted"}
