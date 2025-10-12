from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .common import MongoBaseModel, PyObjectId

class ProjectBase(BaseModel):
    title: str
    description: str
    technologies: List[str]
    github_link: Optional[str] = None
    live_demo: Optional[str] = None
    images: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    date: Optional[datetime] = None

class ProjectCreate(ProjectBase):
    user_id: PyObjectId

class ProjectResponse(MongoBaseModel, ProjectBase):
    user_id: PyObjectId
