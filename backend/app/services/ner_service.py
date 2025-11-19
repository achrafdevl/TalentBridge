"""
NER Service: Named Entity Recognition using LLM (Ollama).

This service handles extraction of named entities from text using LLM,
following the same pattern as ollama_client.py.
It now also organizes EXPERIENCE and EDUCATION blocks by linking titles,
organizations, dates, and locations.
"""

import requests
import json
import logging
from typing import Dict, List
from fastapi import HTTPException

from app.config import settings

logger = logging.getLogger(__name__)

OLLAMA_CHAT_ENDPOINT = f"{settings.OLLAMA_API_URL}/api/chat"

# Expected entity types
ENTITY_TYPES = [
    "PERSON", "ORGANIZATION", "LOCATION", "SKILLS",
    "TECHNOLOGIES", "EDUCATION", "EXPERIENCE", "DATE", "CONTACT"
]

# NER system prompt template
NER_SYSTEM_PROMPT = """You are an expert Named Entity Recognition (NER) system. 
Your task is to extract named entities from text and return them in a structured JSON format.

Extract the following entity types:
1. PERSON
2. ORGANIZATION
3. LOCATION
4. SKILLS
5. TECHNOLOGIES
6. EDUCATION
7. EXPERIENCE
8. DATE
9. CONTACT

IMPORTANT:
- Return ONLY valid JSON, no additional text or markdown
- Each entity type should be a list of strings
- Remove duplicates
- Be precise and extract only relevant entities
- If an entity type has no matches, return an empty list for that type
"""

# ----------------------------
# Core Ollama response parsing
# ----------------------------
def _parse_ollama_response(response: requests.Response) -> str:
    """Parse Ollama API response and extract content string."""
    if response.status_code != 200:
        error_detail = f"HTTP {response.status_code}"
        try:
            data = response.json()
            error_detail = data.get("error", str(data))
        except Exception:
            error_detail = response.text[:500] if response.text else error_detail
        logger.error(f"Ollama API error {response.status_code}: {error_detail}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract entities using LLM. Error: {error_detail}"
        )

    response.raise_for_status()
    try:
        data = response.json()
    except json.JSONDecodeError:
        # fallback for line-separated JSON
        lines = response.text.strip().split("\n")
        data = None
        for line in lines:
            try:
                parsed = json.loads(line)
                if "message" in parsed or "response" in parsed:
                    data = parsed
                    break
            except json.JSONDecodeError:
                continue
        if data is None:
            raise HTTPException(status_code=500, detail="Failed to parse LLM response for entity extraction")

    if "message" in data:
        content = data["message"].get("content", "")
    elif "response" in data:
        content = data["response"]
    else:
        raise HTTPException(status_code=500, detail="Unexpected response format from LLM")

    if not content:
        raise HTTPException(status_code=500, detail="Empty response from LLM")

    return content

def _clean_json_content(content: str) -> str:
    """Remove markdown formatting from JSON string."""
    content = content.strip()
    if content.startswith("```"):
        lines = content.split("\n")
        content = "\n".join(lines[1:-1]) if len(lines) > 2 else content
    return content

def _validate_entities(entities: dict) -> Dict[str, List[str]]:
    """Ensure all entity types exist and are lists."""
    if not isinstance(entities, dict):
        return {etype: [] for etype in ENTITY_TYPES}
    result = {}
    for etype in ENTITY_TYPES:
        value = entities.get(etype, [])
        result[etype] = value if isinstance(value, list) else []
    return result

# ----------------------------
# Main entity extraction
# ----------------------------
def extract_entities_using_llm(text: str) -> Dict[str, List[str]]:
    """Extract NER entities from text using Ollama LLM."""
    if not text.strip():
        return {etype: [] for etype in ENTITY_TYPES}

    try:
        user_prompt = f"Extract all named entities from the following text and return them in JSON format:\n\n{text}"
        payload = {
            "model": settings.OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": NER_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "stream": False
        }
        response = requests.post(OLLAMA_CHAT_ENDPOINT, json=payload, timeout=300)
        content = _parse_ollama_response(response)
        content = _clean_json_content(content)
        entities = json.loads(content)
        return _validate_entities(entities)
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Entity extraction timed out")
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail=f"Cannot connect to Ollama at {settings.OLLAMA_API_URL}")
    except Exception as e:
        logger.error(f"NER extraction failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to extract entities: {e}")

# ----------------------------
# Organize experience/education
# ----------------------------
def organize_entities(entities: dict, text: str) -> dict:
    """
    Build structured EXPERIENCE and EDUCATION blocks:
    Each block links title/degree, organization/school, date, location.
    """
    structured = {"EXPERIENCE_BLOCKS": [], "EDUCATION_BLOCKS": []}

    titles = entities.get("EXPERIENCE", [])
    orgs = entities.get("ORGANIZATION", [])
    dates = entities.get("DATE", [])
    locations = entities.get("LOCATION", [])
    education_items = entities.get("EDUCATION", [])

    # Experience blocks
    for title in titles:
        block = {"title": title, "company": "", "date": "", "location": ""}
        for org in orgs:
            if org.lower() in text.lower():
                block["company"] = org
                break
        for d in dates:
            if d.lower() in text.lower():
                block["date"] = d
                break
        for loc in locations:
            if loc.lower() in text.lower():
                block["location"] = loc
                break
        structured["EXPERIENCE_BLOCKS"].append(block)

    # Education blocks
    for edu in education_items:
        block = {"degree": edu, "school": "", "date": "", "location": ""}
        for org in orgs:
            if org.lower() in text.lower():
                block["school"] = org
                break
        for d in dates:
            if d.lower() in text.lower():
                block["date"] = d
                break
        for loc in locations:
            if loc.lower() in text.lower():
                block["location"] = loc
                break
        structured["EDUCATION_BLOCKS"].append(block)

    return structured

# ----------------------------
# Full pipeline
# ----------------------------
def extract_and_structure_entities(text: str) -> dict:
    """Run NER and organize structured blocks."""
    raw = extract_entities_using_llm(text)
    structured = organize_entities(raw, text)
    return {"raw": raw, "structured": structured}

def extract_entities_safe(text: str) -> dict:
    """Safe wrapper to prevent failure from blocking the flow."""
    try:
        return extract_and_structure_entities(text)
    except Exception as e:
        logger.warning(f"NER extraction failed (safe mode): {e}")
        return {"raw": {}, "structured": {}}
