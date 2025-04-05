import pytest
import unittest

import openai  # Importing openai is necessary for the mock to work

from unittest.mock import patch, MagicMock

from src.services.text_to_speech import text_to_speech  # Replace with actual module name

@pytest.fixture
def mock_openai_response():
    mock_response = MagicMock()
    mock_response['audio'] = b"fake_audio_data"
    return mock_response

def test_text_to_speech(mock_openai_response):
    with patch('openai.Audio.create', return_value=mock_openai_response):
        with patch('builtins.open', unittest.mock.mock_open()) as mock_file:
            story = "Once upon a time, there was a dragon."
            filename = "test_story.mp3"
            
            text_to_speech(story, filename)
            
            # Check if open was called with correct filename
            mock_file.assert_called_with(filename, 'wb')
            
            # Check if the response's audio content was written to the file
            mock_file().write.assert_called_once_with(mock_openai_response['audio'])
