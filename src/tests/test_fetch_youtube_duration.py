import os
import pytest
from dotenv import load_dotenv
from src.data.fetch_youtube_duration import fetch_youtube_duration

# Load environment variables
load_dotenv()

# Test URLs
VALID_YOUTUBE_URL = "https://www.youtube.com/watch?v=R2B2QetWGag"  # Replace with a real working video
INVALID_YOUTUBE_URL = "https://www.youtube.com/watch?v=invalid123"
FAKE_YOUTUBE_URL = "invalid_url"

# Tests
def test_valid_youtube_track():
    api_key = os.environ["YOUTUBE_API_KEY"]
    duration = fetch_youtube_duration(VALID_YOUTUBE_URL, api_key)
    assert isinstance(duration, int) and duration > 0
    print(f"YouTube video duration: {duration} seconds")

def test_invalid_youtube_url():
    api_key = os.environ["YOUTUBE_API_KEY"]
    result = fetch_youtube_duration(INVALID_YOUTUBE_URL, api_key)
    assert result is None

def test_fake_youtube_url():
    api_key = os.environ["YOUTUBE_API_KEY"]
    result = fetch_youtube_duration(FAKE_YOUTUBE_URL, api_key)
    assert result is None
