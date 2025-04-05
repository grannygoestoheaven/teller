import os
import pytest
from src.data.fetch_spotify_duration import fetch_spotify_duration
from dotenv import load_dotenv

load_dotenv()

# Valid Spotify URL
VALID_SPOTIFY_URL = "https://open.spotify.com/track/30vlPqmCjHSAo0JuAn8yiR?si=26a53ca6a1ea429a"

# Tests
def test_valid_spotify_track():
    client_id = os.environ["SPOTIFY_CLIENT_ID"]
    client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]
    
    duration = fetch_spotify_duration(VALID_SPOTIFY_URL, client_id, client_secret)
    assert isinstance(duration, int) and duration > 0  # Ensure valid duration
    print(f"Spotify track duration: {duration} seconds")

def test_invalid_spotify_url():
    result = fetch_spotify_duration("invalid_url", "client_id", "client_secret")
    assert result is None

def test_missing_duration():
    result = fetch_spotify_duration("https://open.spotify.com/track/no_duration", "client_id", "client_secret")
    assert result is None
