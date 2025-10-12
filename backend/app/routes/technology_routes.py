from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from app.models.technology import TechnologyCreate, TechnologyResponse
from app.database import technologies_collection
from app.auth.jwt_handler import verify_access_token

router = APIRouter(prefix="/technologies", tags=["Technologies"])

# Dependency: Extract user from JWT token
def get_current_user(token: str):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload.get("sub")


# Create a new technology
@router.post("/", response_model=TechnologyResponse)
async def create_technology(tech: TechnologyCreate, user_id: str = Depends(get_current_user)):
    tech_dict = tech.dict()
    tech_dict["user_id"] = ObjectId(user_id)
    new_tech = await technologies_collection.insert_one(tech_dict)
    created_tech = await technologies_collection.find_one({"_id": new_tech.inserted_id})
    return TechnologyResponse(**created_tech)


# Get all technologies
@router.get("/", response_model=List[TechnologyResponse])
async def get_technologies():
    technologies = []
    async for tech in technologies_collection.find():
        technologies.append(TechnologyResponse(**tech))
    return technologies


# Update a technology by ID
@router.put("/{tech_id}", response_model=TechnologyResponse)
async def update_technology(tech_id: str, tech: TechnologyCreate, user_id: str = Depends(get_current_user)):
    if not ObjectId.is_valid(tech_id):
        raise HTTPException(status_code=400, detail="Invalid technology ID")

    tech_dict = tech.dict()
    tech_dict["user_id"] = ObjectId(user_id)

    result = await technologies_collection.update_one(
        {"_id": ObjectId(tech_id)}, {"$set": tech_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Technology not found")

    updated_tech = await technologies_collection.find_one({"_id": ObjectId(tech_id)})
    return TechnologyResponse(**updated_tech)


# Delete a technology by ID
@router.delete("/{tech_id}")
async def delete_technology(tech_id: str, user_id: str = Depends(get_current_user)):
    if not ObjectId.is_valid(tech_id):
        raise HTTPException(status_code=400, detail="Invalid technology ID")

    result = await technologies_collection.delete_one({"_id": ObjectId(tech_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Technology not found")

    return {"detail": "Technology deleted successfully"}
