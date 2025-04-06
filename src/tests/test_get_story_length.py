import pytest
from src.services.get_story_length import spotify_story_length, youtube_story_length

@pytest.mark.parametrize("track_duration, wpm, expected", [
    (180, 178, 2670),   # 3 minutes
    (300, 200, 5000),   # 5 minutes
    (0, 178, 0)         # Zero duration
])
def test_spotify_story_length(track_duration, wpm, expected):
    assert spotify_story_length(track_duration, wpm) == expected

@pytest.mark.parametrize("video_duration, wpm, expected", [
    (240, 178, 3560),  # 4 minutes
    (600, 150, 7500),  # 10 minutes
    (0, 178, 0)         # Zero duration
])
def test_youtube_story_length(video_duration, wpm, expected):
    assert youtube_story_length(video_duration, wpm) == expected
