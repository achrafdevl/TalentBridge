import os
import requests
from typing import Dict, Any
from app.config import settings

OLLAMA_CHAT_ENDPOINT = f"{settings.OLLAMA_API_URL}/api/chat"

def call_ollama_chat(system_prompt: str, user_prompt: str, model: str = settings.OLLAMA_MODEL) -> Dict[str, Any]:
    """Call Ollama chat API"""
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_CHAT_ENDPOINT, json=payload, timeout=500)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Ollama API error: {str(e)} - Response: {getattr(e.response, 'text', '')}")

def generate_tailored_cv(cv_text: str, job_text: str) -> str:
    """Generate a tailored CV using Ollama"""
    system_prompt = """Tu es un expert en rédaction de CV et en recrutement. 
    Ta tâche est de personnaliser un CV existant pour correspondre parfaitement à une offre d'emploi spécifique.
    
    Instructions:
    1. Analyse le CV et l'offre d'emploi fournis
    2. Identifie les compétences et expériences du CV qui correspondent aux exigences du poste
    3. Réorganise et reformule le CV pour mettre en avant les éléments les plus pertinents
    4. Garde TOUTES les informations du CV original, mais réorganise-les stratégiquement
    5. Utilise les mots-clés de l'offre d'emploi dans le CV personnalisé
    6. Structure le CV de manière professionnelle avec des sections claires
    
    Format de sortie:
    - Informations personnelles
    - Résumé professionnel (adapté au poste)
    - Compétences clés (en lien avec l'offre)
    - Expérience professionnelle (la plus pertinente en premier)
    - Formation
    - Certifications
    - Projets pertinents
    - Langues
    - Autres compétences"""

    user_prompt = f"""OFFRE D'EMPLOI:
{job_text}

---

CV ORIGINAL:
{cv_text}

---

Génère maintenant un CV personnalisé en français qui met en valeur les compétences et expériences 
les plus pertinentes pour cette offre d'emploi. Garde TOUTES les informations du CV original."""

    response = call_ollama_chat(system_prompt, user_prompt)

    # Extract the generated content
    if "message" in response and "content" in response["message"]:
        return response["message"]["content"]
    else:
        raise Exception("Unexpected response format from Ollama")
