# app/routes/technology_routes.py
from fastapi import APIRouter, HTTPException, Depends
from ..models.cvProfile import Technology, TechnologyInDB
from ..database import technologies_collection
from ..auth.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/technologies", tags=["Technologies"])

@router.post("/", response_model=TechnologyInDB)
async def create_technology(tech: Technology, current_user: dict = Depends(get_current_user)):
    tech_data = tech.dict()
    tech_data["user_id"] = str(current_user["_id"])
    result = await technologies_collection.insert_one(tech_data)
    
    # Convert MongoDB _id to id string
    tech_data["id"] = str(result.inserted_id)
    return TechnologyInDB(**tech_data)

@router.get("/", response_model=list[TechnologyInDB])
async def get_technologies(current_user: dict = Depends(get_current_user)):
    techs = await technologies_collection.find({"user_id": str(current_user["_id"])}).to_list(None)
    # Convert _id to id for each technology
    return [TechnologyInDB(
        id=str(tech["_id"]),
        user_id=tech["user_id"],
        **{k: v for k, v in tech.items() if k not in ["_id", "user_id"]}
    ) for tech in techs]

@router.put("/{tech_id}", response_model=TechnologyInDB)
async def update_technology(tech_id: str, tech: Technology, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(tech_id):
        raise HTTPException(status_code=400, detail="Invalid technology ID")
    
    updated = await technologies_collection.find_one_and_update(
        {"_id": ObjectId(tech_id), "user_id": str(current_user["_id"])},
        {"$set": tech.dict()},
        return_document=True
    )
    
    if not updated:
        raise HTTPException(status_code=404, detail="Technology not found")
    
    # Convert _id to id
    updated["id"] = str(updated.pop("_id"))
    return TechnologyInDB(**updated)

@router.delete("/{tech_id}")
async def delete_technology(tech_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(tech_id):
        raise HTTPException(status_code=400, detail="Invalid technology ID")
    
    result = await technologies_collection.delete_one({"_id": ObjectId(tech_id), "user_id": str(current_user["_id"])})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Technology not found")
    
    return {"message": "Technology deleted"}