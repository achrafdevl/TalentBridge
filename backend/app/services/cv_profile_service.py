from app.database import (
    cv_profile_collection,
    experiences_collection,
    educations_collection,
    projects_collection,
    technologies_collection,
    languages_collection,
    certifications_collection,
    competences_collection
)

async def cv_profile_to_text(user_id: str) -> str:
    """
    Convert user's CV profile and all related data into a formatted text string
    that can be used for CV generation and similarity matching.
    """
    # Get CV profile
    profile = await cv_profile_collection.find_one({"user_id": user_id})
    if not profile:
        raise ValueError(f"CV profile not found for user {user_id}")
    
    # Get all related data
    experiences = await experiences_collection.find({"user_id": user_id}).to_list(None)
    educations = await educations_collection.find({"user_id": user_id}).to_list(None)
    projects = await projects_collection.find({"user_id": user_id}).to_list(None)
    technologies = await technologies_collection.find({"user_id": user_id}).to_list(None)
    languages = await languages_collection.find({"user_id": user_id}).to_list(None)
    certifications = await certifications_collection.find({"user_id": user_id}).to_list(None)
    competences = await competences_collection.find({"user_id": user_id}).to_list(None)
    
    # Build CV text
    lines = []
    
    # Header
    lines.append(profile.get("fullName", ""))
    if profile.get("email"):
        lines.append(f"Email: {profile['email']}")
    if profile.get("location"):
        lines.append(f"Location: {profile['location']}")
    if profile.get("bio"):
        lines.append(f"\n{profile['bio']}")
    
    # Social links
    social_links = profile.get("socialLinks", {})
    if social_links:
        social_line = []
        if social_links.get("linkedin"):
            social_line.append(f"LinkedIn: {social_links['linkedin']}")
        if social_links.get("github"):
            social_line.append(f"GitHub: {social_links['github']}")
        if social_line:
            lines.append(" | ".join(social_line))
    
    # Competences (Soft Skills)
    if competences:
        lines.append("\n## Competences")
        for comp in competences:
            lines.append(f"- {comp.get('name', '')}")
    
    # Technologies
    if technologies:
        lines.append("\n## Technologies")
        tech_by_category = {}
        for tech in technologies:
            category = tech.get("category", "Other")
            if category not in tech_by_category:
                tech_by_category[category] = []
            tech_by_category[category].append(tech.get("name", ""))
        
        for category, tech_names in tech_by_category.items():
            lines.append(f"\n### {category}")
            lines.append(", ".join(tech_names))
    
    # Experience
    if experiences:
        lines.append("\n## Professional Experience")
        for exp in sorted(experiences, key=lambda x: x.get("startDate", ""), reverse=True):
            lines.append(f"\n### {exp.get('position', '')} at {exp.get('company', '')}")
            lines.append(f"{exp.get('location', '')} | {exp.get('startDate', '')} - {exp.get('endDate', '')}")
            if exp.get("responsibilities"):
                lines.append(exp["responsibilities"])
            if exp.get("technologies"):
                lines.append(f"Technologies: {', '.join(exp['technologies'])}")
    
    # Education
    if educations:
        lines.append("\n## Education")
        for edu in sorted(educations, key=lambda x: x.get("startDate", ""), reverse=True):
            lines.append(f"\n### {edu.get('certificate', '')}")
            lines.append(f"{edu.get('school', '')}")
            if edu.get("location"):
                lines.append(f"{edu['location']}")
            lines.append(f"{edu.get('startDate', '')} - {edu.get('endDate', '')}")
    
    # Projects
    if projects:
        lines.append("\n## Projects")
        for proj in projects:
            lines.append(f"\n### {proj.get('title', '')}")
            if proj.get("description"):
                lines.append(proj["description"])
            if proj.get("technologies"):
                lines.append(f"Technologies: {', '.join(proj['technologies'])}")
            if proj.get("githubLink"):
                lines.append(f"GitHub: {proj['githubLink']}")
            if proj.get("liveDemo"):
                lines.append(f"Live Demo: {proj['liveDemo']}")
    
    # Certifications
    if certifications:
        lines.append("\n## Certifications")
        for cert in sorted(certifications, key=lambda x: x.get("issueDate", ""), reverse=True):
            lines.append(f"\n### {cert.get('title', '')}")
            lines.append(f"{cert.get('issuer', '')} | {cert.get('issueDate', '')}")
            if cert.get("type"):
                lines.append(f"Type: {cert['type']}")
    
    # Languages
    if languages:
        lines.append("\n## Languages")
        for lang in languages:
            lines.append(f"- {lang.get('name', '')}: {lang.get('level', '')}")
    
    return "\n".join(lines)

