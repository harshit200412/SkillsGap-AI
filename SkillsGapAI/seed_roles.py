
from backend.app.database import SessionLocal
from backend.app.models import JobRole
from backend.app.roles_data import JOB_ROLES

db = SessionLocal()

try:
    for role in JOB_ROLES:
        existing_role = (
            db.query(JobRole)
            .filter_by(key=role["key"])
            .first()
        )

        if existing_role:
            continue

        new_role = JobRole(
            key=role["key"],
            name=role["name"],
            track=role["track"],
            level=role["level"],
            blurb=role["blurb"],
        )

        db.add(new_role)

    db.commit()
    print(f"Successfully seeded {len(JOB_ROLES)} job roles!")

except Exception as error:
    db.rollback()
    print("Error inserting roles:", error)

finally:
    db.close()
