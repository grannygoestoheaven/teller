import os
import pytest

from dotenv import load_dotenv

from src.data.get_track_duration import get_track_duration, extract_service_name

# Load environment variables
load_dotenv()

# Test URLs
SPOTIFY_URL = "https://open.spotify.com/track/6A9Jcd7AuVhgvMyW2erCIr"  # Replace with a valid URL
YOUTUBE_URL = "https://www.youtube.com/watch?v=R2B2QetWGag"  # Replace with a valid URL

# Tests
def test_extract_service_name():
    assert extract_service_name(SPOTIFY_URL) == "spotify"
    assert extract_service_name(YOUTUBE_URL) == "youtube"
    assert extract_service_name("invalid_url") == "unknown"

def test_spotify_duration():
    client_id = os.environ["SPOTIFY_CLIENT_ID"]
    client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]
    
    duration = get_track_duration(SPOTIFY_URL, client_id, client_secret, None)
    assert isinstance(duration, int) and duration > 0
    print(f"Spotify track duration: {duration} seconds")

def test_youtube_duration():
    api_key = os.environ["YOUTUBE_API_KEY"]
    
    duration = get_track_duration(YOUTUBE_URL, None, None, api_key)
    assert isinstance(duration, int) and duration > 0
    print(f"YouTube video duration: {duration} seconds")

def test_invalid_url():
    result = get_track_duration("invalid_url", None, None, None)
    assert result is None
