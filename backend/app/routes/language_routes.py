# app/routes/language_routes.py
from fastapi import APIRouter, HTTPException, Depends
from ..models.cvProfile import Language, LanguageInDB
from ..database import languages_collection
from ..auth.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/languages", tags=["Languages"])

@router.post("/", response_model=LanguageInDB)
async def create_language(lang: Language, current_user: dict = Depends(get_current_user)):
    lang_data = lang.dict()
    lang_data["user_id"] = str(current_user["_id"])
    result = await languages_collection.insert_one(lang_data)
    
    # Convert MongoDB _id to id string
    lang_data["id"] = str(result.inserted_id)
    return LanguageInDB(**lang_data)

@router.get("/", response_model=list[LanguageInDB])
async def get_languages(current_user: dict = Depends(get_current_user)):
    langs = await languages_collection.find({"user_id": str(current_user["_id"])}).to_list(None)
    # Convert _id to id for each language
    return [LanguageInDB(
        id=str(lang["_id"]),
        user_id=lang["user_id"],
        **{k: v for k, v in lang.items() if k not in ["_id", "user_id"]}
    ) for lang in langs]

@router.put("/{lang_id}", response_model=LanguageInDB)
async def update_language(lang_id: str, lang: Language, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(lang_id):
        raise HTTPException(status_code=400, detail="Invalid language ID")
    
    updated = await languages_collection.find_one_and_update(
        {"_id": ObjectId(lang_id), "user_id": str(current_user["_id"])},
        {"$set": lang.dict()},
        return_document=True
    )
    
    if not updated:
        raise HTTPException(status_code=404, detail="Language not found")
    
    # Convert _id to id
    updated["id"] = str(updated.pop("_id"))
    return LanguageInDB(**updated)

@router.delete("/{lang_id}")
async def delete_language(lang_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(lang_id):
        raise HTTPException(status_code=400, detail="Invalid language ID")
    
    result = await languages_collection.delete_one({"_id": ObjectId(lang_id), "user_id": str(current_user["_id"])})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Language not found")
    
    return {"message": "Language deleted"}