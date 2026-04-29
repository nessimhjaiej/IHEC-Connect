<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from app.modules.auth.schema import (
    LoginRequest, RegisterRequest, TokenResponse,
    VerifyEmailRequest, ForgotPasswordRequest, ResetPasswordRequest,
)
from app.modules.auth.service import (
    authenticate_user, create_user,
    verify_email_code, resend_verify_code,
    create_reset_token, reset_password_with_token,
)
from app.modules.users.model import User
from app.services.recaptcha_service import assert_recaptcha
from app.services.email_service import send_verification_email, send_password_reset_email
from app.core.config import settings

router = APIRouter()


# ── Connexion ─────────────────────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    # 1. Vérifier le CAPTCHA côté serveur
    remote_ip = request.client.host if request.client else ""
    await assert_recaptcha(data.recaptcha_token, remote_ip)

    # 2. Authentifier l'utilisateur
    try:
        user = authenticate_user(db, data.email, data.password)
    except ValueError as e:
        if str(e) == "email_not_verified":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Veuillez vérifier votre email avant de vous connecter."
            )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect."
        )

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


# ── Inscription ───────────────────────────────────────────────────────────────

@router.post("/register", status_code=201)
async def register(data: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    # 1. Vérifier le CAPTCHA
    remote_ip = request.client.host if request.client else ""
    await assert_recaptcha(data.recaptcha_token, remote_ip)

    # 2. Créer l'utilisateur
    try:
        user, code = create_user(
            db,
            name=data.name,
            email=data.email,
            password=data.password,
            level=data.level,
            accepted_terms=data.accepted_terms,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 3. Envoyer l'email de vérification
    await send_verification_email(user.email, user.name, code)

    return {
        "message": "Compte créé. Un code de vérification a été envoyé à votre adresse email IHEC.",
        "email": user.email,
    }


# ── Vérification email ────────────────────────────────────────────────────────

@router.post("/verify-email")
async def verify_email(data: VerifyEmailRequest, db: Session = Depends(get_db)):
    try:
        user = verify_email_code(db, data.email, data.code)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Email vérifié avec succès. Vous pouvez maintenant vous connecter."}


@router.post("/resend-verification")
async def resend_verification(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Renvoie un code de vérification (réutilise ForgotPasswordRequest pour l'email)."""
    try:
        user, code = resend_verify_code(db, data.email)
        await send_verification_email(user.email, user.name, code)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Nouveau code envoyé."}


# ── Mot de passe oublié ───────────────────────────────────────────────────────

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Envoie un email de réinitialisation.
    Retourne toujours 200 (anti-énumération : ne révèle pas si l'email existe).
    """
    user, token = create_reset_token(db, data.email)
    if user and token:
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        await send_password_reset_email(user.email, user.name, reset_link)

    return {
        "message": "Si un compte IHEC existe avec cet email, un lien de réinitialisation a été envoyé."
    }


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        reset_password_with_token(db, data.token, data.new_password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."}


# ── Profil courant ────────────────────────────────────────────────────────────

@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "id":            current_user.id,
        "name":          current_user.name,
        "email":         current_user.email,
        "role":          current_user.role,
        "tutor_status":  current_user.tutor_status,
        "level":         current_user.level,
        "email_verified":current_user.email_verified,
    }


# ── Clé publique reCAPTCHA (pour le frontend) ─────────────────────────────────

@router.get("/recaptcha-site-key")
def get_recaptcha_site_key():
    """Expose la clé publique reCAPTCHA au frontend de manière sécurisée."""
    return {"site_key": settings.RECAPTCHA_SITE_KEY}
=======
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user
from app.modules.auth.repository import AuthRepository
from app.modules.auth.schema import RegisterProfileRequest, SessionResponse
from app.modules.auth.service import AuthService
from app.modules.users.model import StudentProfile, User
from app.modules.users.repository import UserRepository
from app.modules.users.schema import UserRead

router = APIRouter(prefix="/auth", tags=["auth"])



def get_auth_service(session: AsyncSession = Depends(get_db_session)) -> AuthService:
    return AuthService(AuthRepository(session))


@router.post("/register", response_model=SessionResponse)
async def register_profile(
    payload: RegisterProfileRequest,
    session: AsyncSession = Depends(get_db_session),
) -> SessionResponse:
    user = User(
        id=payload.id,
        full_name=payload.full_name,
        email=payload.email,
        is_active=True,
        student_profile=StudentProfile(
            id=payload.id,
            major_id=payload.major_id,
            academic_year_id=payload.academic_year_id,
            is_tutor=False,
            is_alumni=False,
        ),
    )
    saved = await UserRepository(session).upsert(user)
    return SessionResponse(user=UserRead.model_validate(saved))


@router.get("/session", response_model=SessionResponse)
async def get_session(
    current_user: User = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
) -> SessionResponse:
    return await service.get_session(str(current_user.id))
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
