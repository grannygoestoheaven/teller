from src.services.story.text import generate_story_with_openai
from src.services.story.tts import openai_tts

def build_story(subject: str):
    raw_story, cleaned_story, filename = generate_story_with_openai(subject)
    speech_url = openai_tts(raw_story)
    payload = {
        "rawStory": raw_story,
        "cleanedStory": cleaned_story,
        "fileName": filename,
        "speechUrl": speech_url
    }
    return payload
