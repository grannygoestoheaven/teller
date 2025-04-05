import isodate
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

def get_youtube_client(api_key: str):
    return build('youtube', 'v3', developerKey=api_key)

def fetch_youtube_duration(track_url: str, api_key: str) -> int:
    """
    Get the duration of a YouTube video in seconds.
    """
    try:
        video_id = track_url.split('v=')[1].split('&')[0] if 'v=' in track_url else None
        if not video_id:
            print("Invalid YouTube URL format.")
            return None

        youtube = get_youtube_client(api_key)

        request = youtube.videos().list(part="contentDetails", id=video_id)
        response = request.execute()

        # Extract and convert duration (ISO 8601 format)
        duration_str = response['items'][0]['contentDetails']['duration']
        return iso8601_to_seconds(duration_str)

    except HttpError as e:
        print(f"YouTube API error: {e}")
    except (IndexError, KeyError):
        print("Duration not found in response.")
    except Exception as e:
        print(f"Unexpected error: {e}")

    return None

def iso8601_to_seconds(duration_str: str) -> int:
    """Converts ISO 8601 duration to seconds."""
    try:
        return int(isodate.parse_duration(duration_str).total_seconds())
    except Exception:
        print("Failed to convert duration.")
        return None
