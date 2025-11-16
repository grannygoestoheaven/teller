from fastapi import APIRouter
from src.services import generate_story_text, generate_tts
from src.schemas.story import StoryRequest, StoryResponse

router = APIRouter(prefix = "/v1/stories")

@router.post("", response_model = StoryResponse)
def create_story(data: StoryCreate) -> StoryResponse:
    story_text = generate_story_text(data)
    audio_url = generate_tts(story_text)
    return {"text": story_text, "audio_url": audio_url}
