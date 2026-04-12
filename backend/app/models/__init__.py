from app.modules.academic_years.model import AcademicYear
from app.modules.majors.model import Major
from app.modules.users.model import User
from app.modules.subjects.model import Subject
from app.modules.sessions.model import Session
from app.modules.participants.model import SessionParticipant
from app.modules.reviews.model import Review
from app.modules.documents.model import Document
from app.modules.events.model import Event, EventParticipant
from app.modules.opportunities.model import Opportunity

__all__ = [
    "AcademicYear",
    "Major",
    "User",
    "Subject",
    "Session",
    "SessionParticipant",
    "Review",
    "Document",
    "Event",
    "EventParticipant",
    "Opportunity",
]
