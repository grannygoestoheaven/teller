from fastapi import APIRouter

from src.routers.schemas.story import StoryRequest, StoryResponse
from src.services.story.story_service import build_story

router = APIRouter(prefix = "/v1/stories")

@router.post("/new", response_model = StoryResponse)
def teller_story(data: StoryRequest) -> StoryResponse:
    return build_story(data.subject)
