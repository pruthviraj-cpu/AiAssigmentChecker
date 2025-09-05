# from sqlalchemy import Column, Integer, String
# from database import Base
from sqlalchemy import text

from app.models.database import SessionLocal
def create_assignment(class_id: str, title: str) -> None:
    db = SessionLocal()
    try:
        db.execute(
            text("""
                INSERT INTO assignments (title, class_id)
                VALUES (:title, :class_id)
            """),
            {"title": title, "class_id": class_id}
        )
        db.commit()
    except Exception as err:
        print(f"Error inserting assignment: {err}")
        db.rollback()
    finally:
        db.close()
