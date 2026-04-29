from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

async def create_meet_event(title: str, start_time: str, duration_minutes: int = 60) -> str:
    """Crée un événement Google Calendar avec lien Meet et retourne le lien."""
    creds = Credentials(token=None, refresh_token=GOOGLE_REFRESH_TOKEN, ...)
    service = build("calendar", "v3", credentials=creds)
    event = {
        "summary": title,
        "start": {"dateTime": start_time, "timeZone": "Africa/Tunis"},
        "end": {"dateTime": end_time, "timeZone": "Africa/Tunis"},
        "conferenceData": {
            "createRequest": {"requestId": f"ihec-{uuid4()}", "conferenceSolutionKey": {"type": "hangoutsMeet"}}
        }
    }
    result = service.events().insert(calendarId="primary", body=event, conferenceDataVersion=1).execute()
    return result["hangoutLink"]
