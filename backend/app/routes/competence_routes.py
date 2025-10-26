# app/routes/competence_routes.py
from fastapi import APIRouter, HTTPException, Depends
from ..models.cvProfile import Competence, CompetenceInDB
from ..database import competences_collection
from ..auth.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/competences", tags=["Competences"])

@router.post("/", response_model=CompetenceInDB)
async def create_competence(comp: Competence, current_user: dict = Depends(get_current_user)):
    comp_data = comp.dict()
    comp_data["user_id"] = str(current_user["_id"])
    result = await competences_collection.insert_one(comp_data)
    
    # Convert MongoDB _id to id string
    comp_data["id"] = str(result.inserted_id)
    return CompetenceInDB(**comp_data)

@router.get("/", response_model=list[CompetenceInDB])
async def get_competences(current_user: dict = Depends(get_current_user)):
    comps = await competences_collection.find({"user_id": str(current_user["_id"])}).to_list(None)
    # Convert _id to id for each competence
    return [CompetenceInDB(
        id=str(comp["_id"]),
        user_id=comp["user_id"],
        **{k: v for k, v in comp.items() if k not in ["_id", "user_id"]}
    ) for comp in comps]

@router.put("/{comp_id}", response_model=CompetenceInDB)
async def update_competence(comp_id: str, comp: Competence, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(comp_id):
        raise HTTPException(status_code=400, detail="Invalid competence ID")
    
    updated = await competences_collection.find_one_and_update(
        {"_id": ObjectId(comp_id), "user_id": str(current_user["_id"])},
        {"$set": comp.dict()},
        return_document=True
    )
    
    if not updated:
        raise HTTPException(status_code=404, detail="Competence not found")
    
    # Convert _id to id
    updated["id"] = str(updated.pop("_id"))
    return CompetenceInDB(**updated)

@router.delete("/{comp_id}")
async def delete_competence(comp_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(comp_id):
        raise HTTPException(status_code=400, detail="Invalid competence ID")
    
    result = await competences_collection.delete_one({"_id": ObjectId(comp_id), "user_id": str(current_user["_id"])})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Competence not found")
    
    return {"message": "Competence deleted"}