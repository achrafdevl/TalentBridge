from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from typing import List
from app.models.project import ProjectCreate, ProjectResponse
from app.database import projects_collection
from app.auth.jwt_handler import verify_access_token

router = APIRouter(prefix="/projects", tags=["Projects"])

# Dummy dependency to simulate JWT check
def get_current_user(token: str):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload.get("sub")  # user_id from token

@router.post("/", response_model=ProjectResponse)
async def create_project(project: ProjectCreate, user_id: str = Depends(get_current_user)):
    project_dict = project.dict()
    project_dict["user_id"] = ObjectId(user_id)
    new_project = await projects_collection.insert_one(project_dict)
    created_project = await projects_collection.find_one({"_id": new_project.inserted_id})
    return ProjectResponse(**created_project)

@router.get("/", response_model=List[ProjectResponse])
async def get_projects():
    projects = []
    async for project in projects_collection.find():
        projects.append(ProjectResponse(**project))
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str):
    project = await projects_collection.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse(**project)

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: str, project: ProjectCreate, user_id: str = Depends(get_current_user)):
    update_data = {k: v for k, v in project.dict().items() if v is not None}
    updated = await projects_collection.update_one({"_id": ObjectId(project_id)}, {"$set": update_data})
    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    updated_project = await projects_collection.find_one({"_id": ObjectId(project_id)})
    return ProjectResponse(**updated_project)

@router.delete("/{project_id}")
async def delete_project(project_id: str, user_id: str = Depends(get_current_user)):
    result = await projects_collection.delete_one({"_id": ObjectId(project_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}
