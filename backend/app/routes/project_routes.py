# app/routes/project_routes.py
from fastapi import APIRouter, HTTPException, Depends
from ..models.cvProfile import Project, ProjectInDB
from ..database import projects_collection
from ..auth.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectInDB)
async def create_project(project: Project, current_user: dict = Depends(get_current_user)):
    project_data = project.dict()
    project_data["user_id"] = str(current_user["_id"])
    result = await projects_collection.insert_one(project_data)
    
    # Convert MongoDB _id to id string
    project_data["id"] = str(result.inserted_id)
    return ProjectInDB(**project_data)

@router.get("/", response_model=list[ProjectInDB])
async def get_projects(current_user: dict = Depends(get_current_user)):
    projects = await projects_collection.find({"user_id": str(current_user["_id"])}).to_list(None)
    # Convert _id to id for each project
    return [ProjectInDB(
        id=str(proj["_id"]),
        user_id=proj["user_id"],
        **{k: v for k, v in proj.items() if k not in ["_id", "user_id"]}
    ) for proj in projects]

@router.put("/{project_id}", response_model=ProjectInDB)
async def update_project(project_id: str, project: Project, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID")
    
    updated = await projects_collection.find_one_and_update(
        {"_id": ObjectId(project_id), "user_id": str(current_user["_id"])},
        {"$set": project.dict()},
        return_document=True
    )
    
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Convert _id to id
    updated["id"] = str(updated.pop("_id"))
    return ProjectInDB(**updated)

@router.delete("/{project_id}")
async def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID")
    
    result = await projects_collection.delete_one({"_id": ObjectId(project_id), "user_id": str(current_user["_id"])})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project deleted"}