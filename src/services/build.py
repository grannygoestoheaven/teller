from src.services.story.text import generate_story_with_openai
from src.services.story.tts import openai_tts
from src.services.data.local_tracks import get_local_track_path

from src.config.settings import BASE_DIR

def build_story(subject: str):
    raw_story, cleaned_story, file_name = generate_story_with_openai(subject)
    speech_url = openai_tts(raw_story, file_name)
    track_url = get_local_track_path(BASE_DIR)
    payload = {
        "rawStory": raw_story,
        "cleanedStory": cleaned_story,
        "fileName": filename,
        "speechUrl": speech_url,
        "trackUrl" : track_url
    }
    return payload

