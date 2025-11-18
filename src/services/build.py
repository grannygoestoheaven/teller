from src.services.story.text import generate_story_with_openai
from src.services.story.tts import openai_tts
from src.services.data.local_tracks import get_local_track_path

def build_story(subject: str):
    raw_story, cleaned_story, filename = generate_story_with_openai(subject)
    speech_url = openai_tts(raw_story, filename)
    track_url = get_local_track_path()
    payload = {
        "rawStory": raw_story,
        "cleanedStory": cleaned_story,
        "fileName": file_name,
        "speechUrl": speech_url,
        "trackUrl" : track_url
    }
    return payload
