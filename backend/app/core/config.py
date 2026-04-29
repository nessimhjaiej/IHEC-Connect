<<<<<<< HEAD
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./ihec_connect.db"

    # JWT
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # ── Email SMTP (PHPMailer equivalent) ──────────────────────────────────────
    # Pour IHEC, configurer avec le serveur SMTP de l'université
    # ou un service comme Gmail, SendGrid, Mailgun...
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "noreply@ihec.ucar.tn"      # à remplacer
    SMTP_PASSWORD: str = "your-smtp-password"     # à remplacer (App Password pour Gmail)
    SMTP_FROM_NAME: str = "IHEC Connect"
    SMTP_FROM_EMAIL: str = "noreply@ihec.ucar.tn"
    SMTP_TLS: bool = True                         # STARTTLS (port 587) — comme PHPMailer SMTPSecure='tls'
    SMTP_SSL: bool = False                        # SSL direct (port 465)

    # ── Google reCAPTCHA v2 ────────────────────────────────────────────────────
    # Obtenir les clés sur https://www.google.com/recaptcha/admin
    # Type : reCAPTCHA v2 "Je ne suis pas un robot"
    RECAPTCHA_SECRET_KEY: str = "your-recaptcha-secret-key"  # clé secrète (backend)
    RECAPTCHA_SITE_KEY: str = "your-recaptcha-site-key"      # clé publique (frontend)
    RECAPTCHA_VERIFY_URL: str = "https://www.google.com/recaptcha/api/siteverify"

    # ── Reset password token expiry ────────────────────────────────────────────
    RESET_TOKEN_EXPIRE_MINUTES: int = 30

    # ── Frontend URL (for email links) ────────────────────────────────────────
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
=======
from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "IHEC Connect API"
    api_prefix: str = "/api/v1"
    environment: str = "development"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ihec_connect"

    supabase_url: str = "https://your-project.supabase.co"
    supabase_anon_key: str = "replace-me"
    supabase_jwt_audience: str = "authenticated"

    upload_dir: str = "uploads"
    max_upload_size_mb: int = 10


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
