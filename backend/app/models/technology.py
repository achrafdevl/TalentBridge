from pydantic import BaseModel
from typing import Optional
from .common import MongoBaseModel, PyObjectId

class TechnologyBase(BaseModel):
    name: str
    category: str
    icon: Optional[str] = None
    level: Optional[str] = "Intermediate"

class TechnologyCreate(TechnologyBase):
    user_id: PyObjectId

class TechnologyResponse(MongoBaseModel, TechnologyBase):
    user_id: PyObjectId
