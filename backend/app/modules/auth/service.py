<<<<<<< HEAD
import random
import string
import secrets
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.modules.users.model import User
from app.core.security import verify_password, get_password_hash
from app.core.config import settings


def _utcnow():
    return datetime.now(timezone.utc)


# ── Authentification ──────────────────────────────────────────────────────────

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    if not user.email_verified:
        raise ValueError("email_not_verified")
    return user


# ── Inscription ───────────────────────────────────────────────────────────────

def _gen_verify_code() -> str:
    """Génère un code de vérification à 6 chiffres."""
    return "".join(random.choices(string.digits, k=6))


def create_user(db: Session, name: str, email: str, password: str,
                level: str, accepted_terms: bool) -> tuple[User, str]:
    """
    Crée un utilisateur non-vérifié et retourne (user, code_verification).
    Le code doit ensuite être envoyé par email.
    """
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise ValueError("Un compte avec cet email existe déjà.")

    code = _gen_verify_code()
    code_exp = _utcnow() + timedelta(minutes=15)

    user = User(
        name=name,
        email=email,
        hashed_password=get_password_hash(password),
        level=level,
        accepted_terms=accepted_terms,
        email_verified=False,
        verify_code=code,
        verify_code_exp=code_exp,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user, code


# ── Vérification email ────────────────────────────────────────────────────────

def verify_email_code(db: Session, email: str, code: str) -> User:
    """
    Vérifie le code reçu par email.
    Retourne l'utilisateur si valide, sinon lève ValueError.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise ValueError("Compte introuvable.")
    if user.email_verified:
        return user  # déjà vérifié
    if user.verify_code != code:
        raise ValueError("Code incorrect.")
    if user.verify_code_exp and _utcnow() > user.verify_code_exp:
        raise ValueError("Code expiré. Demandez un nouveau code.")

    user.email_verified = True
    user.verify_code = None
    user.verify_code_exp = None
    db.commit()
    db.refresh(user)
    return user


def resend_verify_code(db: Session, email: str) -> tuple[User, str]:
    """Régénère et renvoie un nouveau code de vérification."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise ValueError("Compte introuvable.")
    if user.email_verified:
        raise ValueError("Cet email est déjà vérifié.")

    code = _gen_verify_code()
    user.verify_code = code
    user.verify_code_exp = _utcnow() + timedelta(minutes=15)
    db.commit()
    return user, code


# ── Mot de passe oublié ───────────────────────────────────────────────────────

def create_reset_token(db: Session, email: str) -> tuple[User, str]:
    """
    Génère un token de réinitialisation de mot de passe.
    Retourne (user, token) pour envoyer par email.
    Si l'email n'existe pas, on ne lève pas d'erreur (sécurité anti-énumération).
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None, None  # silencieux côté API

    token = secrets.token_urlsafe(48)  # token cryptographiquement sûr
    user.reset_token = token
    user.reset_token_exp = _utcnow() + timedelta(minutes=settings.RESET_TOKEN_EXPIRE_MINUTES)
    db.commit()
    return user, token


def reset_password_with_token(db: Session, token: str, new_password: str) -> User:
    """
    Réinitialise le mot de passe si le token est valide et non expiré.
    """
    user = db.query(User).filter(User.reset_token == token).first()
    if not user:
        raise ValueError("Lien de réinitialisation invalide ou déjà utilisé.")
    if user.reset_token_exp and _utcnow() > user.reset_token_exp:
        raise ValueError("Lien expiré. Faites une nouvelle demande.")

    user.hashed_password = get_password_hash(new_password)
    user.reset_token = None
    user.reset_token_exp = None
    db.commit()
    db.refresh(user)
    return user
=======
from fastapi import HTTPException, status

from app.modules.auth.repository import AuthRepository
from app.modules.auth.schema import SessionResponse
from app.modules.users.schema import UserRead


class AuthService:
    def __init__(self, repository: AuthRepository) -> None:
        self.repository = repository

    async def get_session(self, user_id: str) -> SessionResponse:
        user = await self.repository.get_user_profile(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authenticated user profile not found.",
            )
        return SessionResponse(user=UserRead.model_validate(user))
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
