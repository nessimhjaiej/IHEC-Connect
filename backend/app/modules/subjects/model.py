<<<<<<< HEAD
from sqlalchemy import Column, Integer, String
=======
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
from app.core.database import Base


class Subject(Base):
    __tablename__ = "subjects"
<<<<<<< HEAD
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
=======

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    major_id: Mapped[int | None] = mapped_column(ForeignKey("majors.id"), nullable=True, index=True)
    academic_year_id: Mapped[int | None] = mapped_column(
        ForeignKey("academic_years.id"), nullable=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    sessions = relationship("Session", back_populates="subject")
    major = relationship("Major", back_populates="subjects")
    academic_year = relationship("AcademicYear", back_populates="subjects")
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
