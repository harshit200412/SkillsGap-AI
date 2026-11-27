from io import BytesIO
from pathlib import Path
import re

import pymupdf
from docx import Document
from fastapi import Depends, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator, model_validator
from sqlalchemy.orm import Session
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from backend.app import models
from backend.app.ai_service import generate_career_chat_reply, generate_personalized_roadmap, search_learning_resources
from backend.app.auth_routes import get_current_user, get_db, router as auth_router
from backend.app.database import Base, SessionLocal, engine
from backend.app.role_skills import ROLE_SKILLS
from backend.app.rate_limits import limiter
from backend.app.roles_data import JOB_ROLES, TRACKS
from backend.app.study_resources import get_starter_resources
from backend.app.skill_analyzer import analyze_resume


app = FastAPI(title="SkillGap AI")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.include_router(auth_router)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RoadmapRequest(BaseModel):
    role_key: str
    matched_skills: list[str] = Field(default_factory=list, max_length=40)
    missing_skills: list[str] = Field(default_factory=list, max_length=40)
    weekly_hours: int = Field(default=8, ge=2, le=40)
    duration_weeks: int = Field(default=6, ge=2, le=16)


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=2000)


class ChatRoadmapWeek(BaseModel):
    week: int = Field(ge=1, le=16)
    focus: str = Field(min_length=1, max_length=160)
    skills: list[str] = Field(default_factory=list, max_length=12)
    tasks: list[str] = Field(default_factory=list, max_length=8)

    @field_validator("skills", "tasks")
    @classmethod
    def bound_context_items(cls, values):
        if any(len(value) > 180 for value in values):
            raise ValueError("Roadmap context items must be 180 characters or shorter.")
        return values


class CareerChatRequest(BaseModel):
    role_key: str | None = None
    messages: list[ChatMessage] = Field(min_length=1, max_length=16)
    roadmap_context: list[ChatRoadmapWeek] = Field(default_factory=list, max_length=16)

    @model_validator(mode="after")
    def validate_history(self):
        if self.messages[0].role != "user" or self.messages[-1].role != "user":
            raise ValueError("Chat history must begin and end with a user message.")
        if any(left.role == right.role for left, right in zip(self.messages, self.messages[1:])):
            raise ValueError("Chat messages must alternate between user and assistant.")
        if sum(len(message.content) for message in self.messages) > 12000:
            raise ValueError("Chat history must be 12,000 characters or shorter.")
        context_size = sum(
            len(week.focus) + sum(map(len, week.skills)) + sum(map(len, week.tasks))
            for week in self.roadmap_context
        )
        if context_size > 12000:
            raise ValueError("Roadmap context must be 12,000 characters or shorter.")
        return self


class StudyMaterialsRequest(BaseModel):
    role: str = Field(min_length=2, max_length=120)
    skill: str = Field(default="", max_length=120)
    query: str = Field(default="", max_length=200)


@app.get("/")
def home():
    return {"message": "Welcome to SkillGap AI"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/study-materials")
@limiter.limit("6/minute")
def study_materials(
    request: Request,
    body: StudyMaterialsRequest,
    current_user: models.User = Depends(get_current_user),
):
    # Free-text roles are intentionally accepted so users are not limited to the demo catalog.
    role = " ".join(body.role.split())
    if not any(character.isalpha() for character in role):
        raise HTTPException(status_code=422, detail="Enter a valid target role.")
    try:
        resources = search_learning_resources(role, body.skill.strip(), body.query.strip())
    except RuntimeError as exc:
        if "not configured" in str(exc):
            raise HTTPException(status_code=503, detail="Gemini is not configured on the backend.") from exc
        if "quota or rate limit" in str(exc):
            raise HTTPException(status_code=503, detail="Gemini API quota is currently exhausted. Check the key's API quota or billing, then try again.") from exc
        raise HTTPException(status_code=502, detail="Live search returned no usable source links. Try a more specific skill.") from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Could not fetch live study materials. Please try again.") from exc
    return {"role": role, "skill": body.skill.strip(), "resources": resources}


@app.get("/api/study-materials/starter/{role_key}")
def starter_study_materials(role_key: str):
    """Serve curated materials for built-in roles without requiring live Gemini search."""
    resources = get_starter_resources(role_key)
    if not resources:
        raise HTTPException(status_code=404, detail="No starter materials are available for this role.")
    role = next((item["name"] for item in JOB_ROLES if item["key"] == role_key), role_key)
    return {"role": role, "resources": resources}


@app.post("/api/chat")
@limiter.limit("10/minute")
def career_chat(
    request: Request,
    body: CareerChatRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not body.role_key or body.role_key not in ROLE_SKILLS:
        raise HTTPException(status_code=400, detail="Select a supported target role before chatting.")

    role = next((item for item in JOB_ROLES if item["key"] == body.role_key), None)
    role_name = role["name"] if role else body.role_key.replace("_", " ").title()
    profile = db.get(models.UserProfile, current_user.id)
    user_name = " ".join((profile.first_name, profile.last_name)).strip() if profile else ""
    try:
        reply = generate_career_chat_reply(
            messages=[message.model_dump() for message in body.messages],
            role_name=role_name,
            allowed_skills=ROLE_SKILLS[body.role_key],
            user_name=user_name,
            roadmap_context=[week.model_dump() for week in body.roadmap_context],
        )
    except RuntimeError as exc:
        detail = str(exc)
        if "GEMINI_API_KEY is not configured" in detail:
            raise HTTPException(status_code=503, detail="Gemini is not configured on the backend.") from exc
        if "quota or rate limit" in detail:
            raise HTTPException(status_code=503, detail="Gemini API quota is currently exhausted. Check the key's API quota or billing, then try again.") from exc
        raise HTTPException(status_code=503, detail="Gemini is temporarily unavailable. Please try again.") from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Gemini could not complete this reply. Please try again.") from exc

    last_message = body.messages[-1].content
    roadmap_request = bool(re.search(r"\b(roadmap|learning path|study plan|learning plan)\b", last_message, re.I))
    action = {"route": "roadmap", "label": "Open your roadmap"} if roadmap_request else None
    return {"reply": reply, "role_key": body.role_key, "action": action}


def role_to_dict(role):
    return {
        "key": role.key,
        "name": role.name,
        "track": role.track,
        "level": role.level,
        "blurb": role.blurb,
        "required_skills": ROLE_SKILLS.get(role.key, []),
    }


@app.get("/api/catalog")
def get_catalog():
    db: Session = SessionLocal()
    try:
        roles = db.query(models.JobRole).order_by(models.JobRole.id).all()
        return {
            "tracks": TRACKS,
            "roles": [role_to_dict(role) for role in roles],
        }
    finally:
        db.close()


@app.get("/api/roles")
def get_roles():
    db: Session = SessionLocal()
    try:
        roles = db.query(models.JobRole).order_by(models.JobRole.id).all()
        return [role_to_dict(role) for role in roles]
    finally:
        db.close()


@app.get("/api/roles/{role_key}")
def get_role(role_key: str):
    db: Session = SessionLocal()
    try:
        role = db.query(models.JobRole).filter_by(key=role_key).first()
        if role is None:
            raise HTTPException(status_code=404, detail="Job role not found")
        return role_to_dict(role)
    finally:
        db.close()


@app.post("/api/analyze-resume")
async def analyze_uploaded_resume(
    file: UploadFile = File(...),
    role_key: str = Form(...),
    current_user: models.User = Depends(get_current_user),
):
    allowed_extensions = {".pdf", ".docx"}
    extension = Path(file.filename or "").suffix.lower()
    if extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Please upload a PDF or DOCX resume.")

    db: Session = SessionLocal()
    try:
        role = db.query(models.JobRole).filter_by(key=role_key).first()
        if role is None:
            raise HTTPException(status_code=404, detail="Job role not found.")
    finally:
        db.close()

    file_bytes = await file.read(5 * 1024 * 1024 + 1)
    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Resume must be 5 MB or smaller.")

    try:
        if extension == ".pdf":
            with pymupdf.open(stream=file_bytes, filetype="pdf") as pdf:
                resume_text = "\n".join(page.get_text() for page in pdf)
        else:
            document = Document(BytesIO(file_bytes))
            resume_text = "\n".join(paragraph.text for paragraph in document.paragraphs)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="The file could not be read. Please check it and try again.",
        )

    if not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found. Scanned resumes need OCR support.",
        )

    result = analyze_resume(resume_text, role_key, role.name)
    result["role_name"] = role.name
    result["user_id"] = current_user.id
    return result


@app.post("/api/generate-roadmap")
def create_personalized_roadmap(
    request: RoadmapRequest,
    current_user: models.User = Depends(get_current_user),
):
    required = ROLE_SKILLS.get(request.role_key)
    if not required:
        raise HTTPException(status_code=404, detail="Skill requirements are not configured for this role.")

    allowed = {skill.casefold(): skill for skill in required}
    matched = []
    missing = []
    for skill in request.matched_skills:
        canonical = allowed.get(skill.casefold())
        if canonical and canonical not in matched:
            matched.append(canonical)
    for skill in request.missing_skills:
        canonical = allowed.get(skill.casefold())
        if canonical and canonical not in missing and canonical not in matched:
            missing.append(canonical)

    # If the client only supplies matched skills, derive the remaining gaps.
    if not request.missing_skills:
        missing = [skill for skill in required if skill not in matched]

    db: Session = SessionLocal()
    try:
        role = db.query(models.JobRole).filter_by(key=request.role_key).first()
        if role is None:
            raise HTTPException(status_code=404, detail="Job role not found.")
        role_name = role.name
    finally:
        db.close()

    try:
        roadmap = generate_personalized_roadmap(
            role_name=role_name,
            matched_skills=matched,
            missing_skills=missing,
            weekly_hours=request.weekly_hours,
            duration_weeks=request.duration_weeks,
        )
        return {
            **roadmap.model_dump(),
            "generation_mode": "gemini_ai",
            "user_id": current_user.id,
            "role_key": request.role_key,
        }
    except Exception:
        # A predictable fallback keeps the feature usable during API outages.
        weeks = []
        for week_number in range(1, request.duration_weeks + 1):
            start = (week_number - 1) * len(missing) // request.duration_weeks
            end = week_number * len(missing) // request.duration_weeks
            week_skills = missing[start:end]
            if not week_skills:
                week_skills = missing[(week_number - 1) % len(missing):(week_number - 1) % len(missing) + 1] if missing else []
            weeks.append({
                "week": week_number,
                "focus": ", ".join(week_skills) if week_skills else "Build and consolidate your portfolio",
                "skills": week_skills,
                "tasks": [{
                    "title": f"Practice {skill}",
                    "description": f"Study the fundamentals of {skill} and apply them in a small practical exercise.",
                    "estimated_hours": min(float(request.weekly_hours), 3.0),
                    "deliverable": f"A small exercise demonstrating {skill}.",
                } for skill in week_skills],
            })
        return {
            "title": f"Personalized {role_name} learning roadmap",
            "goal": f"Develop the skills required for {role_name}.",
            "total_weeks": request.duration_weeks,
            "weeks": weeks,
            "final_project": f"Build a portfolio project demonstrating the key skills for {role_name}.",
            "success_criteria": [f"Demonstrate {skill} in a completed project." for skill in missing[:8]],
            "generation_mode": "rule_based_fallback",
            "user_id": current_user.id,
            "role_key": request.role_key,
        }
