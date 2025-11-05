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
    suitable for CV generation or similarity matching.
    """
    # Fetch main profile
    profile = await cv_profile_collection.find_one({"user_id": user_id})
    if not profile:
        raise ValueError(f"CV profile not found for user {user_id}")
    
    # Fetch related collections
    experiences = await experiences_collection.find({"user_id": user_id}).to_list(None)
    educations = await educations_collection.find({"user_id": user_id}).to_list(None)
    projects = await projects_collection.find({"user_id": user_id}).to_list(None)
    technologies = await technologies_collection.find({"user_id": user_id}).to_list(None)
    languages = await languages_collection.find({"user_id": user_id}).to_list(None)
    certifications = await certifications_collection.find({"user_id": user_id}).to_list(None)
    competences = await competences_collection.find({"user_id": user_id}).to_list(None)

    lines = []

    # === HEADER ===
    lines.append(profile.get("fullName", ""))
    contact_parts = []
    if email := profile.get("email"):
        contact_parts.append(f"Email: {email}")
    if location := profile.get("location"):
        contact_parts.append(f"Location: {location}")
    if contact_parts:
        lines.append(" | ".join(contact_parts))

    if bio := profile.get("bio"):
        lines.append(f"\n{bio.strip()}")

    # === SOCIAL LINKS ===
    social_links = profile.get("socialLinks", {})
    socials = []
    if linkedin := social_links.get("linkedin"):
        socials.append(f"LinkedIn: {linkedin}")
    if github := social_links.get("github"):
        socials.append(f"GitHub: {github}")
    if socials:
        lines.append(" | ".join(socials))

    # === COMPETENCES ===
    if competences:
        lines.append("\n## Competences")
        for comp in competences:
            name = comp.get("name")
            if name:
                lines.append(f"- {name}")

    # === TECHNOLOGIES ===
    if technologies:
        lines.append("\n## Technologies")
        tech_by_category = {}
        for tech in technologies:
            category = tech.get("category", "Other")
            tech_by_category.setdefault(category, []).append(tech.get("name", ""))

        for category, tech_names in tech_by_category.items():
            lines.append(f"\n### {category}")
            lines.append(", ".join(filter(None, tech_names)))

    # === EXPERIENCE ===
    if experiences:
        lines.append("\n## Professional Experience")
        for exp in sorted(experiences, key=lambda x: x.get("startDate", ""), reverse=True):
            lines.append(f"\n### {exp.get('position', '')} at {exp.get('company', '')}")
            date_info = f"{exp.get('startDate', '')} - {exp.get('endDate', 'Present')}"
            location = exp.get("location", "")
            lines.append(" | ".join(filter(None, [location, date_info])))

            if resp := exp.get("responsibilities"):
                lines.append(resp.strip())
            if techs := exp.get("technologies"):
                lines.append(f"Technologies: {', '.join(techs)}")

    # === EDUCATION ===
    if educations:
        lines.append("\n## Education")
        for edu in sorted(educations, key=lambda x: x.get("startDate", ""), reverse=True):
            lines.append(f"\n### {edu.get('certificate', '')}")
            lines.append(edu.get("school", ""))
            if loc := edu.get("location"):
                lines.append(loc)
            lines.append(f"{edu.get('startDate', '')} - {edu.get('endDate', '')}")

    # === PROJECTS ===
    if projects:
        lines.append("\n## Projects")
        for proj in projects:
            lines.append(f"\n### {proj.get('title', '')}")
            if desc := proj.get("description"):
                lines.append(desc.strip())
            if techs := proj.get("technologies"):
                lines.append(f"Technologies: {', '.join(techs)}")
            if github := proj.get("githubLink"):
                lines.append(f"GitHub: {github}")
            if demo := proj.get("liveDemo"):
                lines.append(f"Live Demo: {demo}")

    # === CERTIFICATIONS ===
    if certifications:
        lines.append("\n## Certifications")
        for cert in sorted(certifications, key=lambda x: x.get("issueDate", ""), reverse=True):
            lines.append(f"\n### {cert.get('title', '')}")
            issuer_info = f"{cert.get('issuer', '')} | {cert.get('issueDate', '')}"
            lines.append(issuer_info)
            if cert_type := cert.get("type"):
                lines.append(f"Type: {cert_type}")

    # === LANGUAGES ===
    if languages:
        lines.append("\n## Languages")
        for lang in languages:
            lines.append(f"- {lang.get('name', '')}: {lang.get('level', '')}")

    return "\n".join(lines)
