from fastapi import APIRouter
from typing import List
from datetime import datetime
from app.models.contact import ContactCreate, ContactResponse
from app.database import contacts_collection

router = APIRouter(prefix="/contacts", tags=["Contacts"])

@router.post("/", response_model=ContactResponse)
async def create_contact(contact: ContactCreate):
    contact_dict = contact.dict()
    contact_dict["created_at"] = datetime.utcnow()
    new_contact = await contacts_collection.insert_one(contact_dict)
    created_contact = await contacts_collection.find_one({"_id": new_contact.inserted_id})
    return ContactResponse(**created_contact)

@router.get("/", response_model=List[ContactResponse])
async def get_contacts():
    contacts = []
    async for contact in contacts_collection.find():
        contacts.append(ContactResponse(**contact))
    return contacts
