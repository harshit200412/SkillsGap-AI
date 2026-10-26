
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.app import models
from backend.app.database import Base, engine, SessionLocal
from backend.app.roles_data import TRACKS

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
 