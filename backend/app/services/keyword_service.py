import re
from typing import List, Set
from collections import Counter

# Common stop words (French and English)
STOP_WORDS = {
    'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'à', 'pour', 'dans', 'sur', 'avec',
    'par', 'est', 'sont', 'être', 'avoir', 'faire', 'peut', 'doit', 'sera', 'été', 'ce', 'se', 'que',
    'qui', 'quoi', 'comme', 'mais', 'donc', 'car', 'si', 'ne', 'pas', 'plus', 'très', 'tout', 'tous',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is',
    'are', 'was', 'were', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
}

# Technical and professional keywords to prioritize
TECH_KEYWORDS = {
    'python', 'java', 'javascript', 'react', 'vue', 'angular', 'node', 'typescript', 'php', 'ruby',
    'sql', 'mongodb', 'mysql', 'postgresql', 'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'git', 'ci/cd', 'agile', 'scrum', 'api', 'rest', 'graphql', 'microservices', 'devops', 'ml',
    'ai', 'machine learning', 'deep learning', 'data science', 'analytics', 'big data', 'cloud',
    'frontend', 'backend', 'fullstack', 'mobile', 'ios', 'android', 'flutter', 'react native',
    'management', 'leadership', 'project', 'team', 'communication', 'collaboration', 'analysis'
}

def extract_keywords(text: str, max_keywords: int = 15) -> List[str]:
    """
    Extract important keywords from text, prioritizing technical terms.
    
    Args:
        text: Input text to analyze
        max_keywords: Maximum number of keywords to return
    
    Returns:
        List of keywords sorted by importance
    """
    if not text:
        return []
    
    # Normalize text
    text = text.lower()
    text = re.sub(r'[^\w\s-]', ' ', text)
    
    # Split into words and filter
    words = re.findall(r'\b\w+(?:-\w+)*\b', text)
    
    # Filter out stop words and short words
    filtered_words = [
        w for w in words 
        if len(w) > 3 and w not in STOP_WORDS
    ]
    
    # Count word frequencies
    word_counts = Counter(filtered_words)
    
    # Boost technical keywords
    scored_words = []
    for word, count in word_counts.items():
        score = count
        if word in TECH_KEYWORDS:
            score *= 2  # Boost technical keywords
        scored_words.append((word, score, count))
    
    # Sort by score (descending)
    scored_words.sort(key=lambda x: x[1], reverse=True)
    
    # Extract unique keywords
    keywords = []
    seen = set()
    for word, _, _ in scored_words:
        if word not in seen:
            keywords.append(word)
            seen.add(word)
            if len(keywords) >= max_keywords:
                break
    
    return keywords

def find_common_keywords(cv_keywords: List[str], job_keywords: List[str]) -> List[str]:
    """
    Find common keywords between CV and job keywords.
    
    Args:
        cv_keywords: List of keywords from CV
        job_keywords: List of keywords from job description
    
    Returns:
        List of common keywords
    """
    cv_set = {k.lower() for k in cv_keywords}
    job_set = {k.lower() for k in job_keywords}
    common = cv_set.intersection(job_set)
    return sorted(list(common))

def get_keyword_coverage(cv_keywords: List[str], job_keywords: List[str]) -> float:
    """
    Calculate how many job keywords are covered by CV keywords.
    
    Returns:
        Coverage ratio between 0 and 1
    """
    if not job_keywords:
        return 0.0
    
    cv_set = {k.lower() for k in cv_keywords}
    job_set = {k.lower() for k in job_keywords}
    matched = len(cv_set.intersection(job_set))
    return round(matched / len(job_set), 4)

