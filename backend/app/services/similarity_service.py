from sentence_transformers import SentenceTransformer, util
import re

model = SentenceTransformer('thenlper/gte-base')   

def preprocess(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s.,;!?-]', '', text)
    return text.strip()[:3000]

def compute_similarity(cv_text: str, job_text: str) -> float:
    cv_text, job_text = preprocess(cv_text), preprocess(job_text)
    cv_emb = model.encode(cv_text, convert_to_tensor=True)
    job_emb = model.encode(job_text, convert_to_tensor=True)
    similarity = util.cos_sim(cv_emb, job_emb).item()
    return round(similarity, 4)
