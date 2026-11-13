"""Resume skill extraction and role-specific gap analysis.

Gemini is used for evidence-based resume extraction when configured.
A deterministic keyword analyser remains available as a fallback.
"""

from __future__ import annotations

import logging
import re

from backend.app.role_skills import ROLE_SKILLS, SKILL_ALIASES

logger = logging.getLogger(__name__)


def _contains_phrase(text: str, phrase: str) -> bool:
    pattern = (
        r"(?<![a-z0-9])"
        + re.escape(phrase.lower())
        + r"(?![a-z0-9])"
    )
    return re.search(pattern, text.lower()) is not None


def extract_skills(text: str) -> list[str]:
    """Rule-based fallback: identify canonical skills mentioned in text."""
    found: list[str] = []
    normalized_text = text.lower()

    all_skills = sorted(
        {skill for skills in ROLE_SKILLS.values() for skill in skills},
        key=str.lower,
    )

    for skill in all_skills:
        candidates = [skill.lower(), *SKILL_ALIASES.get(skill.lower(), [])]
        if any(_contains_phrase(normalized_text, candidate) for candidate in candidates):
            found.append(skill)

    return found


def _fallback_analysis(text: str, role_key: str) -> dict:
    required_skills = ROLE_SKILLS[role_key]
    detected_skills = extract_skills(text)
    detected_set = {skill.casefold() for skill in detected_skills}

    matched = [skill for skill in required_skills if skill.casefold() in detected_set]
    missing = [skill for skill in required_skills if skill.casefold() not in detected_set]
    percentage = round(len(matched) / len(required_skills) * 100) if required_skills else 0

    return {
        "role_key": role_key,
        "detected_skills": detected_skills,
        "required_skills": required_skills,
        "matched_skills": matched,
        "missing_skills": missing,
        "match_percentage": percentage,
        "total_required": len(required_skills),
        "total_matched": len(matched),
        "analysis_mode": "rule_based_fallback",
        "professional_summary": "",
        "experience_highlights": [],
        "education_highlights": [],
        "strengths": [],
        "improvement_suggestions": [
            "Gemini AI analysis was unavailable, so keyword-based matching was used."
        ],
        "skill_evidence": [],
    }


def analyze_resume(text: str, role_key: str, role_name: str | None = None) -> dict:
    """Compare a resume with the selected role using Gemini when available."""
    if role_key not in ROLE_SKILLS:
        raise ValueError("Unsupported job role")

    required_skills = ROLE_SKILLS[role_key]

    try:
        from backend.app.ai_service import extract_resume_with_gemini

        resolved_role_name = role_name or role_key.replace("_", " ").title()
        extracted = extract_resume_with_gemini(
            resume_text=text,
            role_name=resolved_role_name,
            allowed_skills=required_skills,
        )

        # Only accept exact canonical skills returned by the structured model.
        allowed_lookup = {skill.casefold(): skill for skill in required_skills}
        accepted = []
        evidence_rows = []
        for item in extracted.skills:
            canonical = allowed_lookup.get(item.skill.casefold())
            if not canonical or not item.evidence.strip():
                continue
            # Require the evidence phrase to actually occur in the supplied resume.
            if not _contains_phrase(text, item.evidence.strip()):
                continue
            if canonical not in accepted:
                accepted.append(canonical)
                evidence_rows.append({
                    "skill": canonical,
                    "evidence": item.evidence.strip(),
                    "confidence": round(item.confidence, 2),
                })

        matched = [skill for skill in required_skills if skill in accepted]
        missing = [skill for skill in required_skills if skill not in accepted]
        percentage = round(len(matched) / len(required_skills) * 100) if required_skills else 0

        return {
            "role_key": role_key,
            "detected_skills": accepted,
            "required_skills": required_skills,
            "matched_skills": matched,
            "missing_skills": missing,
            "match_percentage": percentage,
            "total_required": len(required_skills),
            "total_matched": len(matched),
            "analysis_mode": "gemini_ai",
            "professional_summary": extracted.professional_summary,
            "experience_highlights": extracted.experience_highlights,
            "education_highlights": extracted.education_highlights,
            "strengths": extracted.strengths,
            "improvement_suggestions": extracted.improvement_suggestions,
            "skill_evidence": evidence_rows,
        }

    except Exception:
        # Do not log resume text, API keys, or the model's raw response.
        logger.exception("Gemini resume analysis failed; using rule-based fallback.")
        return _fallback_analysis(text, role_key)
