"""
Service Google reCAPTCHA v2 — vérification côté serveur.

Flux :
  1. Le frontend charge le widget Google reCAPTCHA avec RECAPTCHA_SITE_KEY
  2. L'utilisateur coche "Je ne suis pas un robot"
  3. Google renvoie un token g-recaptcha-response au frontend
  4. Le frontend envoie ce token avec le formulaire au backend
  5. Le backend appelle siteverify pour valider le token → ce fichier
"""

import httpx
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"


async def verify_recaptcha(token: str, remote_ip: str = "") -> dict:
    """
    Vérifie un token reCAPTCHA v2 auprès des serveurs Google.
    
    Retourne un dict avec :
      - success (bool)     : vérification réussie
      - score (None)       : non disponible en v2 (disponible en v3)
      - error_codes (list) : codes d'erreur éventuels
    """
    if not token:
        return {"success": False, "error_codes": ["missing-input-response"]}

    # En développement avec la clé test Google, toujours valide
    # Clés de test : sitekey=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
    #               secret=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

    payload = {
        "secret":   settings.RECAPTCHA_SECRET_KEY,
        "response": token,
    }
    if remote_ip:
        payload["remoteip"] = remote_ip

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(VERIFY_URL, data=payload)
            data = resp.json()
            
        return {
            "success":     data.get("success", False),
            "error_codes": data.get("error-codes", []),
            "hostname":    data.get("hostname", ""),
        }
    except Exception as e:
        logger.error(f"reCAPTCHA verify error: {e}")
        return {"success": False, "error_codes": ["network-error"]}


async def assert_recaptcha(token: str, remote_ip: str = "") -> None:
    """
    Vérifie le token et lève une HTTPException si invalide.
    À utiliser dans les routes FastAPI.
    """
    from fastapi import HTTPException, status
    result = await verify_recaptcha(token, remote_ip)
    if not result["success"]:
        codes = result.get("error_codes", [])
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vérification CAPTCHA échouée : {', '.join(codes) if codes else 'token invalide'}"
        )
