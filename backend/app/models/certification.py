from pydantic import BaseModel
from datetime import date
from typing import Optional
from enum import Enum
from .common import MongoBaseModel, PyObjectId

# Define allowed types
class CertificationType(str, Enum):
    CERTIFICATE = "certificat"
    DIPLOMA = "diplôme"

class CertificationBase(BaseModel):
    title: str
    issuer: str
    issue_date: date
    type: CertificationType
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None

# Client should NOT send user_id
class CertificationCreate(CertificationBase):
    pass

# Response includes user_id (from DB)
class CertificationResponse(MongoBaseModel, CertificationBase):
    user_id: PyObjectId
