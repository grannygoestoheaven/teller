import pytest
from unittest.mock import patch, MagicMock
import tempfile
import time

from src.services.play_audio import play_audio_with_sync  # Replace with actual module path

@pytest.fixture
def mock_vlc():
    with patch('vlc.MediaPlayer') as mock_vlc_player:
        yield mock_vlc_player

@pytest.fixture
def mock_tempfile():
    with patch('tempfile.NamedTemporaryFile') as mock_temp_file:
        mock_temp = MagicMock()
        mock_temp.name = "fake_temp_path.mp3"  # Ensure this is a string
        mock_temp_file.return_value.__enter__.return_value = mock_temp
        yield mock_temp_file

def test_play_audio_with_sync(mock_vlc, mock_tempfile):
    # Mock the play method of vlc.MediaPlayer
    mock_track_player = MagicMock()
    mock_speech_player = MagicMock()

    # Mock the behavior of vlc.MediaPlayer
    def mock_media_player(url):
        print(f"Mocking MediaPlayer for URL: {url}")  # Debug print
        if url == track_url:
            return mock_track_player
        elif url == mock_tempfile.return_value.__enter__.return_value.name:
            return mock_speech_player
        else:
            return None  # Return None for unexpected URLs

    mock_vlc.side_effect = mock_media_player

    track_url = "http://fake-track-url.com"
    speech_audio = b"fake_audio_data"

    with patch('time.sleep', return_value=None):  # Mock sleep to avoid delays in test
        play_audio_with_sync(track_url, speech_audio)

    # Check if the VLC players were created with the correct paths
    mock_vlc.assert_any_call(track_url)
    mock_vlc.assert_any_call(mock_tempfile.return_value.__enter__.return_value.name)

    # Check if play() was called on both players
    assert mock_track_player.play.call_count == 1
    assert mock_speech_player.play.call_count == 1

    # Ensure tempfile was created correctly
    mock_tempfile.assert_called_once_with(suffix=".mp3", delete=False)
