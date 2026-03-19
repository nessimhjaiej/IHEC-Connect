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
    database_url: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/ihec_connect"
    )
    supabase_url: str = "https://your-project.supabase.co"
    supabase_anon_key: str = "replace-me"
    supabase_jwt_audience: str = "authenticated"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
