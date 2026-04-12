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
