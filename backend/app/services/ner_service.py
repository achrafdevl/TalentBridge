"""
NER Service: Named Entity Recognition using LLM (Ollama).

This service handles extraction of named entities from text using LLM,
following the same pattern as ollama_client.py.
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
1. PERSON: Full names of people (e.g., "John Doe", "Marie Martin")
2. ORGANIZATION: Company names, institutions, universities (e.g., "Microsoft", "MIT", "Google")
3. LOCATION: Cities, countries, addresses (e.g., "Paris", "United States", "123 Main St")
4. SKILLS: Technical and soft skills (e.g., "Project Management", "Communication", "Python")
5. TECHNOLOGIES: Programming languages, tools, frameworks, software (e.g., "React", "Docker", "PostgreSQL")
6. EDUCATION: Degrees, certifications, courses (e.g., "Bachelor of Science", "AWS Certified", "MBA")
7. EXPERIENCE: Job titles, roles, positions (e.g., "Software Engineer", "Project Manager", "Data Scientist")
8. DATE: Dates mentioned (e.g., "2020-2024", "January 2023", "2019")
9. CONTACT: Email addresses, phone numbers, URLs, social media profiles

IMPORTANT:
- Return ONLY valid JSON, no additional text or markdown
- Each entity type should be a list of strings
- Remove duplicates
- Be precise and extract only relevant entities
- If an entity type has no matches, return an empty list for that type

Output format:
{
  "PERSON": ["entity1", "entity2"],
  "ORGANIZATION": ["entity1"],
  "LOCATION": ["entity1"],
  "SKILLS": ["entity1", "entity2"],
  "TECHNOLOGIES": ["entity1", "entity2"],
  "EDUCATION": ["entity1"],
  "EXPERIENCE": ["entity1"],
  "DATE": ["entity1"],
  "CONTACT": ["entity1"]
}"""


def _parse_ollama_response(response: requests.Response) -> str:
    """
    Parse Ollama API response and extract content.
    
    Args:
        response: The HTTP response from Ollama API
        
    Returns:
        The extracted content string
        
    Raises:
        HTTPException: If response cannot be parsed
    """
    if response.status_code != 200:
        error_detail = f"HTTP {response.status_code}"
        try:
            error_data = response.json()
            if "error" in error_data:
                error_detail = error_data["error"]
            elif isinstance(error_data, dict):
                error_detail = str(error_data)
        except:
            error_detail = response.text[:500] if response.text else error_detail
        
        logger.error(f"Ollama API error {response.status_code}: {error_detail}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract entities using LLM. "
                   f"Verify Ollama is running and model '{settings.OLLAMA_MODEL}' is available. "
                   f"Error: {error_detail}"
        )
    
    response.raise_for_status()
    
    # Parse JSON response
    try:
        data = response.json()
    except (ValueError, json.JSONDecodeError) as e:
        response_text = response.text.strip()
        logger.warning(f"Failed to parse JSON directly, attempting line-by-line. "
                      f"Response preview: {response_text[:200]}")
        
        if "\n" in response_text:
            lines = response_text.split("\n")
            data = None
            for line in lines:
                line = line.strip()
                if line:
                    try:
                        parsed = json.loads(line)
                        if "message" in parsed or "response" in parsed:
                            data = parsed
                            break
                        elif data is None:
                            data = parsed
                    except json.JSONDecodeError:
                        continue
            
            if data is None:
                logger.error(f"Could not parse any valid JSON from response: {response_text[:500]}")
                raise HTTPException(
                    status_code=500,
                    detail="Failed to parse LLM response for entity extraction"
                )
        else:
            logger.error(f"Invalid JSON response: {response_text[:500]}")
            raise HTTPException(
                status_code=500,
                detail="Invalid JSON response from LLM"
            )
    
    # Extract content from response
    if "message" in data:
        content = data["message"].get("content", "")
    elif "response" in data:
        content = data["response"]
    else:
        logger.warning(f"Unexpected Ollama response structure: {data}")
        raise HTTPException(
            status_code=500,
            detail="Unexpected response format from LLM"
        )
    
    if not content:
        logger.warning("Empty content from Ollama for NER extraction")
        raise HTTPException(
            status_code=500,
            detail="Empty response from LLM"
        )
    
    return content


def _clean_json_content(content: str) -> str:
    """
    Clean JSON content by removing markdown code blocks if present.
    
    Args:
        content: Raw content string that may contain markdown
        
    Returns:
        Cleaned JSON string
    """
    content = content.strip()
    if content.startswith("```"):
        # Remove markdown code blocks
        lines = content.split("\n")
        content = "\n".join(lines[1:-1]) if len(lines) > 2 else content
    elif content.startswith("```json"):
        lines = content.split("\n")
        content = "\n".join(lines[1:-1]) if len(lines) > 2 else content
    return content


def _validate_entities(entities: dict) -> Dict[str, List[str]]:
    """
    Validate and normalize entities structure.
    
    Args:
        entities: Raw entities dictionary from LLM
        
    Returns:
        Validated entities dictionary with all expected types
    """
    if not isinstance(entities, dict):
        logger.warning(f"LLM returned non-dict entities: {type(entities)}")
        return {}
    
    # Ensure all expected entity types exist with empty lists if missing
    result = {}
    for entity_type in ENTITY_TYPES:
        result[entity_type] = entities.get(entity_type, [])
        # Ensure it's a list
        if not isinstance(result[entity_type], list):
            result[entity_type] = []
    
    total_entities = sum(len(v) for v in result.values())
    logger.info(f"Successfully extracted {total_entities} total entities")
    return result


def extract_entities_using_llm(text: str) -> Dict[str, List[str]]:
    """
    NER: Extract Named Entities Using LLM (Ollama).
    
    Extracts named entities from text using LLM including:
    - PERSON: Names of people
    - ORGANIZATION: Company names, institutions
    - LOCATION: Cities, countries, addresses
    - SKILLS: Technical and soft skills
    - TECHNOLOGIES: Programming languages, tools, frameworks
    - EDUCATION: Degrees, certifications
    - EXPERIENCE: Job titles, roles
    - DATE: Dates mentioned
    - CONTACT: Email, phone numbers, URLs
    
    Args:
        text: The input text to extract entities from
        
    Returns:
        Dictionary with entity types as keys and lists of entities as values
        
    Raises:
        HTTPException: If LLM extraction fails
    """
    if not text or not text.strip():
        logger.warning("Empty text provided for entity extraction")
        return {}
    
    try:
        user_prompt = f"""Extract all named entities from the following text and return them in JSON format:

{text}

Return the entities grouped by type in JSON format as specified."""

        payload = {
            "model": settings.OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": NER_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "stream": False
        }
        
        logger.info(f"Calling Ollama for NER extraction on {len(text)} characters of text")
        response = requests.post(OLLAMA_CHAT_ENDPOINT, json=payload, timeout=300)
        
        # Parse response
        content = _parse_ollama_response(response)
        
        # Clean JSON content
        content = _clean_json_content(content)
        
        # Parse entities JSON
        try:
            entities = json.loads(content)
            return _validate_entities(entities)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse entities JSON from LLM response: {e}")
            logger.debug(f"LLM response content: {content[:500]}")
            raise HTTPException(
                status_code=500,
                detail="LLM returned invalid JSON format for entities. Please try again."
            )
        
    except requests.exceptions.Timeout:
        logger.error("Ollama request timed out for NER extraction")
        raise HTTPException(
            status_code=504,
            detail="Entity extraction timed out. Please try again."
        )
    except requests.exceptions.ConnectionError:
        logger.error("Cannot connect to Ollama for NER extraction")
        raise HTTPException(
            status_code=503,
            detail=f"Cannot connect to Ollama at {settings.OLLAMA_API_URL}. "
                   f"Please ensure Ollama is running."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"NER extraction failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract entities: {str(e)}"
        )


def extract_entities_safe(text: str) -> Dict[str, List[str]]:
    """
    Safely extract entities without raising exceptions.
    
    This function is useful in contexts where entity extraction failure
    should not block the main operation (e.g., file upload).
    
    Args:
        text: The input text to extract entities from
        
    Returns:
        Dictionary with entity types as keys and lists of entities as values.
        Returns empty dict if extraction fails.
    """
    try:
        return extract_entities_using_llm(text)
    except Exception as e:
        logger.warning(f"NER extraction failed (safe mode): {e}")
        return {}

