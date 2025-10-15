# # backend/main.py
# from fastapi import FastAPI, HTTPException, Query
# from pydantic import BaseModel
# import requests
# import os

# app = FastAPI()

# # Put your Jooble API key in an environment variable JOOBLE_API_KEY
# JOOBLE_KEY = os.getenv("JOOBLE_API_KEY", "YOUR_JOOBLE_API_KEY")

# class JoobleRequest(BaseModel):
#     keywords: str
#     location: str | None = None
#     page: int | None = 1
#     salary: str | None = None

# @app.get("/health")
# def health():
#     return {"status": "ok"}

# @app.get("/jobs")
# def get_jobs(q: str = Query(..., description="search keywords"),
#              location: str | None = None,
#              page: int = 1,
#              limit: int = 20):
#     """
#     Proxy endpoint that queries Jooble REST API and returns jobs JSON.
#     """
#     if JOOBLE_KEY == "YOUR_JOOBLE_API_KEY" or not JOOBLE_KEY:
#         raise HTTPException(status_code=500, detail="Server not configured with JOOBLE_API_KEY")

#     # Jooble expects a POST to /api/{api_key} with JSON body including keywords, location, page
#     url = f"https://jooble.org/api/{JOOBLE_KEY}"
#     payload = {
#         "keywords": q,
#         "location": location or "",
#         "page": page,
#         "count": limit
#     }

#     try:
#         r = requests.post(url, json=payload, timeout=10)
#         r.raise_for_status()
#     except requests.RequestException as e:
#         raise HTTPException(status_code=502, detail=f"Jooble API request failed: {str(e)}")

#     data = r.json()
#     # Jooble returns {"jobs": [...], "total": ...} usually — but check the response you get.
#     return data
