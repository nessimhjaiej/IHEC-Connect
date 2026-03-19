from typing import Any

import httpx
from jose import JWTError, jwt

from app.core.config import settings

_jwks_cache: dict[str, Any] | None = None


async def get_supabase_jwks() -> dict[str, Any]:
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache

    jwks_url = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(jwks_url)
        response.raise_for_status()
        _jwks_cache = response.json()
    return _jwks_cache


async def decode_supabase_token(token: str) -> dict[str, Any] | None:
    try:
        jwks = await get_supabase_jwks()
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            audience=settings.supabase_jwt_audience,
            issuer=f"{settings.supabase_url}/auth/v1",
        )
    except JWTError:
        return None
    return payload
