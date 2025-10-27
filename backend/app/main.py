
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    user_routes,
    project_routes,
    experience_routes,
    technology_routes,
    certification_routes,
    competence_routes,  
    language_routes,    
    education_routes,
    cv_profile_routes,
    cv_routes, 
    job_routes, 
    generate_routes
)
from app.auth import auth_routes

app = FastAPI(title="TalentBridge")

# CORS configuration for frontend
origins = [
    "http://localhost:3000",
    "https://yourfrontenddomain.com"  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          
    allow_credentials=True,
    allow_methods=["*"],            
    allow_headers=["*"],            
)

# Auth routes
app.include_router(auth_routes.router)

# User routes
app.include_router(user_routes.router)

# CV Profile routes (separate from user auth)
app.include_router(cv_profile_routes.router)

# CV Section routes
app.include_router(project_routes.router)
app.include_router(technology_routes.router)
app.include_router(competence_routes.router)
app.include_router(language_routes.router)
app.include_router(experience_routes.router)
app.include_router(education_routes.router)
app.include_router(certification_routes.router)

# Generate CV routes
app.include_router(cv_routes.router)
app.include_router(job_routes.router)
app.include_router(generate_routes.router)

@app.get("/")
def root():
    return {"message": "TalentBridge is running"}