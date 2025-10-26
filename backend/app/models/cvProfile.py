from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import date

# CvProfile
class CvProfile(BaseModel):
    fullName: str
    email: str
    bio: Optional[str] = None
    location: Optional[str] = None
    profileImage: Optional[str] = None
    socialLinks: Dict[str, Optional[str]] = Field(default_factory=dict)  # e.g., {"linkedin": "", "github": ""}

class CvProfileInDB(CvProfile):
    id: str
    user_id: str

class CvProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    profileImage: Optional[str] = None
    socialLinks: Optional[Dict[str, Optional[str]]] = None

# Technology
class Technology(BaseModel):
    name: str
    category: str
    icon: Optional[str] = None

class TechnologyInDB(Technology):
    id: str
    user_id: str

# Competence (used for Soft Skills and Competences)
class Competence(BaseModel):
    name: str

class CompetenceInDB(Competence):
    id: str
    user_id: str

# Project
class Project(BaseModel):
    title: str
    description: str
    technologies: List[str] = Field(default_factory=list)
    githubLink: Optional[str] = None
    liveDemo: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    date: Optional[str] = None  # e.g., "2023-12"

class ProjectInDB(Project):
    id: str
    user_id: str

# Language
class Language(BaseModel):
    name: str
    level: str  # e.g., "Native", "Fluent", "Advanced", etc.

class LanguageInDB(Language):
    id: str
    user_id: str

# Experience
class Experience(BaseModel):
    company: str
    position: str
    location: str
    startDate: str
    endDate: str
    responsibilities: str
    technologies: List[str] = Field(default_factory=list)

class ExperienceInDB(Experience):
    id: str
    user_id: str

# Education
class Education(BaseModel):
    school: str
    certificate: str
    startDate: str
    endDate: str
    location: Optional[str] = None

class EducationInDB(Education):
    id: str
    user_id: str

# Certification
class Certification(BaseModel):
    title: str
    issuer: str
    issueDate: str  # e.g., "2023-06"
    type: str  # "certificat" or "diplôme"
    credentialId: Optional[str] = None
    credentialUrl: Optional[str] = None

class CertificationInDB(Certification):
    id: str
    user_id: str