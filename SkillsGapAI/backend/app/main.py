
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.app import models
from backend.app.database import Base, engine, SessionLocal
from backend.app.roles_data import TRACKS
from fastapi import FastAPI, HTTPException, File, Form, UploadFile
from io import BytesIO
from pathlib import Path

import fitz
from docx import Document

from backend.app.skill_analyzer import analyze_resume


app = FastAPI(title="SkillGap AI")

Base.metadata.create_all(bind=engine)

# Allow the local frontend to communicate with FastAPI.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def home():
    return {
        "message": "Welcome to SkillGap AI"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy"
    }


def role_to_dict(role):
    return {
        "key": role.key,
        "name": role.name,
        "track": role.track,
        "level": role.level,
        "blurb": role.blurb
    }


@app.get("/api/catalog")
def get_catalog():
    db: Session = SessionLocal()

    try:
        roles = db.query(models.JobRole).order_by(
            models.JobRole.id
        ).all()

        return {
            "tracks": TRACKS,
            "roles": [role_to_dict(role) for role in roles]
        }
    finally:
        db.close()


@app.get("/api/roles")
def get_roles():
    db: Session = SessionLocal()

    try:
        roles = db.query(models.JobRole).order_by(
            models.JobRole.id
        ).all()

        return [role_to_dict(role) for role in roles]
    finally:
        db.close()


@app.get("/api/roles/{role_key}")
def get_role(role_key: str):
    db: Session = SessionLocal()

    try:
        role = db.query(models.JobRole).filter_by(
            key=role_key
        ).first()

        if role is None:
            raise HTTPException(
                status_code=404,
                detail="Job role not found"
            )

        return role_to_dict(role)
    finally:
        db.close()
 
 
@app.post("/api/analyze-resume")
async def analyze_uploaded_resume(
    file: UploadFile = File(...),
    role_key: str = Form(...)
):
    allowed_extensions = {".pdf", ".docx"}
    extension = Path(file.filename or "").suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF or DOCX resume."
        )

    # Check that the selected role exists.
    db: Session = SessionLocal()
    try:
        role = db.query(models.JobRole).filter_by(
            key=role_key
        ).first()

        if role is None:
            raise HTTPException(
                status_code=404,
                detail="Job role not found."
            )
    finally:
        db.close()

    # Read at most 5 MB plus one byte to detect oversized files.
    file_bytes = await file.read(5 * 1024 * 1024 + 1)

    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Resume must be 5 MB or smaller."
        )

    try:
        if extension == ".pdf":
            with fitz.open(
                stream=file_bytes,
                filetype="pdf"
            ) as pdf:
                text = "\n".join(
                    page.get_text() for page in pdf
                )
        else:
            document = Document(BytesIO(file_bytes))
            text = "\n".join(
                paragraph.text
                for paragraph in document.paragraphs
            )

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="The file could not be read. Please check it and try again."
        )

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found. Scanned resumes need OCR support."
        )

    result = analyze_resume(text, role_key)
    result["role_name"] = role.name

    return result
