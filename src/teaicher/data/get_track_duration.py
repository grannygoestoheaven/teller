from teaicher.data.fetch_spotify_duration import fetch_spotify_duration
from teaicher.data.fetch_youtube_duration import fetch_youtube_duration

def extract_service_name(track_url: str) -> str:
    if "spotify.com" in track_url:
        return "spotify"
    elif "youtube.com" in track_url:
        return "youtube"
    else:
        return "unknown"

def get_track_duration(track_url: str, client_id: str, client_secret: str, api_key: str) -> int:
    service = extract_service_name(track_url)

    if service == "spotify":
        return fetch_spotify_duration(track_url, client_id, client_secret)
    elif service == "youtube":
        return fetch_youtube_duration(track_url, api_key)
    else:
        print("Unsupported URL format.")
        return None  # Return None instead of raising an error
