<<<<<<< HEAD
import re
from pydantic import BaseModel, EmailStr, field_validator

# Format email IHEC : prenom.nom.annee@ihec.ucar.tn
IHEC_EMAIL_RE = re.compile(
    r"^[a-zA-ZÀ-ÿ]+\.[a-zA-ZÀ-ÿ]+\.\d{4}@ihec\.ucar\.tn$", re.IGNORECASE
)


def validate_ihec_email(email: str) -> str:
    if not IHEC_EMAIL_RE.match(email):
        raise ValueError(
            "Seuls les emails IHEC sont acceptés : prenom.nom.annee@ihec.ucar.tn"
        )
    return email.lower()


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str
    recaptcha_token: str  # token reCAPTCHA v2 obligatoire à la connexion

    @field_validator("email")
    @classmethod
    def check_email(cls, v):
        return validate_ihec_email(v)


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    confirm_password: str  # ← confirmation de mot de passe
    level: str
    accepted_terms: bool
    recaptcha_token: str   # ← token reCAPTCHA v2 obligatoire

    @field_validator("email")
    @classmethod
    def check_email(cls, v):
        return validate_ihec_email(v)

    @field_validator("password")
    @classmethod
    def check_password(cls, v):
        if len(v) < 8:
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères.")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Le mot de passe doit contenir au moins une majuscule.")
        if not re.search(r"\d", v):
            raise ValueError("Le mot de passe doit contenir au moins un chiffre.")
        return v

    @field_validator("confirm_password")
    @classmethod
    def check_confirm(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Les mots de passe ne correspondent pas.")
        return v

    @field_validator("accepted_terms")
    @classmethod
    def check_terms(cls, v):
        if not v:
            raise ValueError("Vous devez accepter les conditions d'utilisation.")
        return v


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Vérification email ────────────────────────────────────────────────────────

class VerifyEmailRequest(BaseModel):
    email: str
    code: str

    @field_validator("email")
    @classmethod
    def check_email(cls, v):
        return validate_ihec_email(v)


# ── Mot de passe oublié ───────────────────────────────────────────────────────

class ForgotPasswordRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def check_email(cls, v):
        return validate_ihec_email(v)


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_new_password: str

    @field_validator("new_password")
    @classmethod
    def check_password(cls, v):
        if len(v) < 8:
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères.")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Le mot de passe doit contenir au moins une majuscule.")
        if not re.search(r"\d", v):
            raise ValueError("Le mot de passe doit contenir au moins un chiffre.")
        return v

    @field_validator("confirm_new_password")
    @classmethod
    def check_confirm(cls, v, info):
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Les mots de passe ne correspondent pas.")
        return v
=======
import uuid

from pydantic import BaseModel, EmailStr, Field

from app.modules.users.schema import UserRead


class SessionResponse(BaseModel):
    user: UserRead


class RegisterProfileRequest(BaseModel):
    id: uuid.UUID
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    major_id: int | None = None
    academic_year_id: int | None = None
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
