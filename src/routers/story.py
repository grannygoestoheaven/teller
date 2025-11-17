from fastapi import APIRouter

from src.schemas.story import StoryRequest, StoryResponse
from src.services.story.text import generate_story_with_openai
from src.services.story.tts import openai_text_to_speech

router = APIRouter(prefix = "/v1/stories")

@router.post("/new", StoryResponse)
def create_story(data: StoryCreate) -> StoryResponse:
    story_text = generate_story_with_openai(data.subject)
    audio_url = generate_tts(story_text)
    return {"text": story_text, "audio_url": audio_url}
