import os
import pytest
from dotenv import load_dotenv
from src.services.generate_story import generate_story

# Load environment variables
load_dotenv()

# Test cases
def test_generate_story():
    prompt = "Once upon a time, in a faraway land, there was a dragon."
    num_chars = 100  # Length of the story

    story = generate_story(prompt, num_chars)
    
    # Ensure the result is a string
    assert isinstance(story, str)
    
    # Ensure the story length is reasonable (just an example, you can adjust this)
    assert len(story) > 0

    print(f"Generated Story: {story}")

def test_invalid_prompt():
    prompt = ""
    num_chars = 100

    story = generate_story(prompt, num_chars)
    
    # Check that an empty prompt may still return something (depending on your logic)
    assert isinstance(story, str)
    assert len(story) > 0  # Even an empty prompt should return a valid output
