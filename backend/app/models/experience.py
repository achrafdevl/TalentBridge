from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from .common import MongoBaseModel, PyObjectId

class ExperienceBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = []

class ExperienceCreate(ExperienceBase):
    user_id: PyObjectId

class ExperienceResponse(MongoBaseModel, ExperienceBase):
    user_id: PyObjectId
