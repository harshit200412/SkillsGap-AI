
import re

ROLE_SKILLS = {
    "backend": [
        "Python", "Java", "SQL", "PostgreSQL", "REST API",
        "FastAPI", "Django", "Flask", "Git", "Docker",
        "Database Design", "Authentication"
    ],
    "analyst": [
        "SQL", "Python", "Excel", "Power BI", "Tableau",
        "Statistics", "Data Visualization", "Pandas",
        "NumPy", "Data Cleaning"
    ],
    "pm": [
        "Product Strategy", "Market Research", "User Research",
        "Agile", "Scrum", "Communication", "Data Analysis",
        "Roadmapping", "Prioritization", "Product Analytics"
    ],
    "marketing": [
        "SEO", "Content Marketing", "Social Media Marketing",
        "Google Analytics", "Email Marketing", "Market Research",
        "Copywriting", "Digital Marketing", "Excel", "Communication"
    ],
    "finance": [
        "Excel", "Financial Modeling", "Accounting",
        "Financial Analysis", "Valuation", "SQL",
        "Budgeting", "Forecasting", "Power BI", "Statistics"
    ],
    "ops": [
        "Supply Chain Management", "Inventory Management",
        "Excel", "SQL", "Project Management", "Logistics",
        "Procurement", "Forecasting", "Data Analysis",
        "Communication"
    ],
    "civil": [
        "AutoCAD", "Revit", "Structural Analysis",
        "Quantity Surveying", "Project Management",
        "Construction Management", "Site Safety",
        "Estimation", "Technical Drawing", "Quality Control"
    ],
    "mech": [
        "AutoCAD", "SolidWorks", "CATIA", "GD&T",
        "CAD", "FEA", "Ansys", "Thermodynamics",
        "Technical Drawing", "Manufacturing"
    ]
}

# Common alternative names for skills.
ALIASES = {
    "javascript": ["js"],
    "typescript": ["ts"],
    "postgresql": ["postgres"],
    "power bi": ["powerbi"],
    "rest api": ["rest apis", "restful api", "restful apis"],
    "fastapi": ["fast api"],
    "scikit-learn": ["sklearn"],
    "machine learning": ["ml"],
    "node.js": ["nodejs", "node js"],
    "supply chain management": ["supply chain"],
    "social media marketing": ["social media"],
    "financial modeling": ["financial modelling"],
    "solidworks": ["solid works"],
    "autocad": ["auto cad"],
    "gd&t": ["geometric dimensioning and tolerancing"],
    "fea": ["finite element analysis"],
}


def extract_skills(text: str) -> list[str]:
    """Identify known skills mentioned in resume text."""
    found = []
    normalized_text = text.lower()

    for skill_list in ROLE_SKILLS.values():
        for skill in skill_list:
            if skill in found:
                continue

            candidates = [skill.lower()]
            candidates.extend(ALIASES.get(skill.lower(), []))

            for candidate in candidates:
                pattern = (
                    r"(?<![a-z0-9])"
                    + re.escape(candidate)
                    + r"(?![a-z0-9])"
                )

                if re.search(pattern, normalized_text):
                    found.append(skill)
                    break

    return sorted(found, key=str.lower)


def analyze_resume(text: str, role_key: str) -> dict:
    """Compare detected resume skills with a role's skill checklist."""
    if role_key not in ROLE_SKILLS:
        raise ValueError("Unsupported job role")

    resume_skills = extract_skills(text)
    required_skills = ROLE_SKILLS[role_key]

    # Compare case-insensitively.
    resume_skill_set = {skill.lower() for skill in resume_skills}

    matched = [
        skill for skill in required_skills
        if skill.lower() in resume_skill_set
    ]

    missing = [
        skill for skill in required_skills
        if skill.lower() not in resume_skill_set
    ]

    percentage = round(
        len(matched) / len(required_skills) * 100
    ) if required_skills else 0

    return {
        "role_key": role_key,
        "detected_skills": resume_skills,
        "required_skills": required_skills,
        "matched_skills": matched,
        "missing_skills": missing,
        "match_percentage": percentage,
        "total_required": len(required_skills),
        "total_matched": len(matched)
    }
