from pydantic import BaseModel, EmailStr
from datetime import datetime
from .common import MongoBaseModel

class ContactBase(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactCreate(ContactBase):
    pass

class ContactResponse(MongoBaseModel, ContactBase):
    created_at: datetime
