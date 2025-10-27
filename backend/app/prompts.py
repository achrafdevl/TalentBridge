def build_analysis_prompt(cv_text: str, job_text: str):
    system_prompt = "You are an AI assistant that tailors CVs to match job offers. Generate a complete, structured CV with sections like Summary, Experience, Education, Skills, etc., emphasizing relevant parts."
    user_prompt = f"Full CV:\n{cv_text}\n\nJob Offer:\n{job_text}\n\nTailor the CV to highlight matching skills, experiences, and qualifications. Output in a professional CV format."
    return system_prompt, user_prompt