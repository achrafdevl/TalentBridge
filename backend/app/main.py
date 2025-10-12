from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    user_routes,
    project_routes,
    experience_routes,
    technology_routes,
    certification_routes,
    contact_routes
)
from app.auth import auth_routes

app = FastAPI(title="TalentBridge")

# CORS configuration for frontend
origins = [
    "http://localhost:3000",  # Next.js frontend (development)
    "https://yourfrontenddomain.com"  # Production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Allow these origins
    allow_credentials=True,
    allow_methods=["*"],            # Allow GET, POST, PUT, DELETE...
    allow_headers=["*"],            # Allow all headers
)

# Auth routes
app.include_router(auth_routes.router)

# User routes
app.include_router(user_routes.router)

# Portfolio sections
app.include_router(project_routes.router)
app.include_router(experience_routes.router)
app.include_router(technology_routes.router)
app.include_router(certification_routes.router)
app.include_router(contact_routes.router)

@app.get("/")
def root():
    return {"message": "TalentBridge is running"}
