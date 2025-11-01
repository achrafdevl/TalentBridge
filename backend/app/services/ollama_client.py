import requests
import json
from app.config import settings
import logging

logger = logging.getLogger(__name__)

OLLAMA_CHAT_ENDPOINT = f"{settings.OLLAMA_API_URL}/api/chat"

def generate_tailored_cv(cv_text: str, job_text: str) -> str:
    """
    Call Ollama to generate a tailored CV based on job description.
    """
    try:
        # Professional system prompt that emphasizes preserving all information
        system_prompt = """You are an expert CV writer that tailors CVs to match specific job offers while maintaining professionalism and completeness.

CRITICAL REQUIREMENTS:
1. PRESERVE ALL INFORMATION from the original CV - do not delete any experiences, education, skills, projects, certifications, or languages
2. Reorganize and emphasize relevant information to match the job description
3. Use professional language and action verbs
4. Maintain chronological order where applicable
5. Format the output with clear sections using markdown headings (## for main sections, ### for subsections)
6. Include all contact information (name, email, location, social links)
7. Highlight relevant technologies and skills that match the job requirements
8. Quantify achievements where possible
9. Keep the professional summary/bio concise but impactful

OUTPUT FORMAT:
- Use ## for main section headings (e.g., ## Professional Summary, ## Professional Experience, ## Education)
- Use ### for subsections or entries
- Use bullet points (-) for lists
- Keep formatting clean and consistent"""

        user_prompt = f"""Job Description:
{job_text}

Original CV Information:
{cv_text}

Generate a professional, tailored CV that:
1. Includes ALL information from the original CV (nothing should be deleted)
2. Emphasizes and reorganizes sections to best match this job description
3. Uses professional formatting with clear sections
4. Highlights relevant skills, experiences, and achievements
5. Maintains a professional tone throughout
6. Formats dates, locations, and technical details clearly

Output the complete CV in markdown format with proper headings and structure."""

        payload = {
            "model": settings.OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        }

        # Ensure streaming is disabled for complete response
        payload["stream"] = False
        
        response = requests.post(OLLAMA_CHAT_ENDPOINT, json=payload, timeout=500)
        
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
            user_message = (
                f"Erreur lors de la génération du CV. "
                f"Vérifiez que Ollama est en cours d'exécution et que le modèle '{settings.OLLAMA_MODEL}' est disponible. "
                f"Détails: {error_detail}"
            )
            raise Exception(user_message)
        
        response.raise_for_status()
        
        # Parse JSON response - handle potential streaming or multiple JSON objects
        try:
            # Try to parse as single JSON object
            data = response.json()
        except (ValueError, json.JSONDecodeError) as e:
            # If that fails, try parsing line by line (for streaming responses or multiple JSON objects)
            response_text = response.text.strip()
            logger.warning(f"Failed to parse JSON directly, attempting line-by-line. Response preview: {response_text[:200]}")
            
            if "\n" in response_text:
                # Multiple JSON objects - try to parse each line
                lines = response_text.split("\n")
                data = None
                for line in lines:
                    line = line.strip()
                    if line:
                        try:
                            parsed = json.loads(line)
                            # Prefer the one with "message" or "response" field
                            if "message" in parsed or "response" in parsed:
                                data = parsed
                            elif data is None:
                                data = parsed  # Fallback to first valid JSON
                        except json.JSONDecodeError:
                            continue
                if data is None:
                    logger.error(f"Could not parse any valid JSON from response: {response_text[:500]}")
                    raise Exception(f"Could not parse Ollama response. Invalid JSON format: {str(e)}")
            else:
                logger.error(f"Invalid JSON response: {response_text[:500]}")
                raise Exception(f"Invalid JSON response from Ollama: {str(e)}")
        
        # Extract content from response
        if "message" in data:
            content = data["message"].get("content", "")
            if not content:
                raise Exception("Ollama returned empty response")
            return content
        elif "response" in data:
            if not data["response"]:
                raise Exception("Ollama returned empty response")
            return data["response"]
        else:
            logger.warning(f"Unexpected Ollama response: {data}")
            raise Exception("Unexpected response format from Ollama API")
    except requests.exceptions.Timeout:
        logger.error("Ollama request timed out")
        raise Exception("Request to Ollama timed out. The model may be processing. Please try again.")
    except requests.exceptions.ConnectionError:
        logger.error("Cannot connect to Ollama")
        raise Exception(f"Cannot connect to Ollama at {settings.OLLAMA_API_URL}. Please ensure Ollama is running.")
    except Exception as e:
        logger.error(f"Ollama CV generation failed: {e}")
        raise
