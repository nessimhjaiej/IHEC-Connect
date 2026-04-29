<<<<<<< HEAD
"""
Service Email — Équivalent Python de PHPMailer
Utilise aiosmtplib (async SMTP) avec STARTTLS, comme PHPMailer avec SMTPSecure='tls'

PHPMailer équivalences :
  $mail->Host       → SMTP_HOST
  $mail->Port       → SMTP_PORT
  $mail->SMTPAuth   → True (toujours)
  $mail->Username   → SMTP_USER
  $mail->Password   → SMTP_PASSWORD
  $mail->SMTPSecure → 'tls' si SMTP_TLS=true, 'ssl' si SMTP_SSL=true
  $mail->From       → SMTP_FROM_EMAIL
  $mail->FromName   → SMTP_FROM_NAME
"""

import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


async def send_email(to: str, subject: str, html_body: str, text_body: str = "") -> bool:
    """
    Envoie un email HTML via SMTP — équivalent de PHPMailer->send()
    Retourne True si succès, False sinon.
    """
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
    msg["To"]      = to

    if text_body:
        msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        if settings.SMTP_SSL:
            # Port 465 — SSL direct (PHPMailer: SMTPSecure='ssl')
            await aiosmtplib.send(
                msg,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USER,
                password=settings.SMTP_PASSWORD,
                use_tls=True,
            )
        else:
            # Port 587 — STARTTLS (PHPMailer: SMTPSecure='tls')
            await aiosmtplib.send(
                msg,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USER,
                password=settings.SMTP_PASSWORD,
                start_tls=True,
            )
        logger.info(f"Email envoyé à {to} : {subject}")
        return True
    except Exception as e:
        logger.error(f"Échec envoi email à {to} : {e}")
        return False


# ── Templates HTML ─────────────────────────────────────────────────────────────

def _base_template(title: str, content: str) -> str:
    return f"""
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
</head>
<body style="margin:0;padding:0;background:#f0eff4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0eff4;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e4e3f0;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#2d2b55,#3d3a6e);padding:32px 40px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <span style="font-size:28px;">🎓</span>
              <span style="font-family:'Segoe UI',Arial,sans-serif;font-weight:800;font-size:20px;color:#ffffff;">IHEC Connect</span>
            </div>
            <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:8px 0 0;">Université de Carthage — IHEC</p>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:36px 40px;">
            {content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f7ff;padding:20px 40px;text-align:center;border-top:1px solid #e4e3f0;">
            <p style="color:#a8a7c0;font-size:12px;margin:0;">
              Cet email a été envoyé automatiquement par IHEC Connect.<br>
              Ne pas répondre à cet email. Pour toute aide : <a href="mailto:support@ihec.ucar.tn" style="color:#7c6fcd;">support@ihec.ucar.tn</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""


async def send_verification_email(to: str, name: str, code: str) -> bool:
    """Email de vérification de compte — envoyé à l'inscription."""
    content = f"""
    <h2 style="font-size:22px;font-weight:800;color:#2d2b55;margin:0 0 8px;">Vérifiez votre email</h2>
    <p style="color:#6e6d8a;font-size:14px;margin:0 0 28px;">Bonjour <strong>{name}</strong>, bienvenue sur IHEC Connect !</p>

    <p style="color:#4a4a6a;font-size:14px;line-height:1.7;margin:0 0 24px;">
      Pour activer votre compte, entrez le code de vérification ci-dessous sur la plateforme :
    </p>

    <div style="text-align:center;margin:28px 0;">
      <div style="display:inline-block;background:linear-gradient(135deg,#7c6fcd,#6b9bd2);border-radius:16px;padding:20px 40px;">
        <span style="font-family:'Courier New',monospace;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:10px;">{code}</span>
      </div>
      <p style="color:#a8a7c0;font-size:12px;margin:12px 0 0;">Ce code expire dans <strong>15 minutes</strong>.</p>
    </div>

    <div style="background:#fff8e8;border:1px solid #f0d888;border-radius:12px;padding:14px 18px;margin:20px 0;">
      <p style="color:#7a5a10;font-size:13px;margin:0;">
        🔒 Si vous n'avez pas créé de compte IHEC Connect, ignorez cet email.
      </p>
    </div>
    """
    html = _base_template("Vérification de votre compte IHEC Connect", content)
    text = f"Bonjour {name},\n\nVotre code de vérification IHEC Connect : {code}\n\nCe code expire dans 15 minutes."
    return await send_email(to, "🎓 Vérifiez votre compte IHEC Connect", html, text)


async def send_password_reset_email(to: str, name: str, reset_link: str) -> bool:
    """Email de réinitialisation de mot de passe."""
    content = f"""
    <h2 style="font-size:22px;font-weight:800;color:#2d2b55;margin:0 0 8px;">Réinitialiser votre mot de passe</h2>
    <p style="color:#6e6d8a;font-size:14px;margin:0 0 24px;">Bonjour <strong>{name}</strong>,</p>

    <p style="color:#4a4a6a;font-size:14px;line-height:1.7;margin:0 0 24px;">
      Vous avez demandé la réinitialisation de votre mot de passe IHEC Connect.<br>
      Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
    </p>

    <div style="text-align:center;margin:32px 0;">
      <a href="{reset_link}" style="display:inline-block;background:linear-gradient(135deg,#7c6fcd,#6b9bd2);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:12px;">
        Réinitialiser mon mot de passe
      </a>
    </div>

    <p style="color:#a8a7c0;font-size:13px;text-align:center;margin:0 0 16px;">
      Ou copiez ce lien dans votre navigateur :<br>
      <span style="color:#7c6fcd;word-break:break-all;">{reset_link}</span>
    </p>

    <div style="background:#fff0ee;border:1px solid #f0c0b8;border-radius:12px;padding:14px 18px;margin:20px 0;">
      <p style="color:#a0301a;font-size:13px;margin:0;">
        ⚠️ Ce lien expire dans <strong>30 minutes</strong>.<br>
        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
      </p>
    </div>
    """
    html = _base_template("Réinitialisation de mot de passe — IHEC Connect", content)
    text = f"Bonjour {name},\n\nRéinitialisez votre mot de passe ici : {reset_link}\n\nCe lien expire dans 30 minutes."
    return await send_email(to, "🔐 Réinitialisation de votre mot de passe IHEC Connect", html, text)
=======
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USER,
    MAIL_PASSWORD=settings.SMTP_PASSWORD,
    MAIL_FROM=settings.SMTP_FROM,
    MAIL_PORT=587,
    MAIL_SERVER=settings.SMTP_HOST,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
)

async def send_registration_email(email: str, full_name: str):
    message = MessageSchema(
        subject="Bienvenue sur IHEC Connect !",
        recipients=[email],
        body=f"Bonjour {full_name}, votre compte a été créé avec succès.",
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

async def send_reservation_confirmation(email: str, session_title: str, meet_link: str):
    message = MessageSchema(
        subject=f"Réservation confirmée : {session_title}",
        recipients=[email],
        body=f"Votre réservation est confirmée. Rejoignez la séance : {meet_link}",
        subtype="html"
    )
    await FastMail(conf).send_message(message)
>>>>>>> b315ad8349eafde528c9209e3b7ff6d217909d43
