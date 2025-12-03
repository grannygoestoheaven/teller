import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from src.schemas.story import StoryRequest, StoryResponse
from src.services.build import build_story, load_story
from src.config.settings import BASE_DIR

router = APIRouter()

# generation endpoint for an unexisting story
@router.post("/new", response_model = StoryResponse)
def teller_story(data: StoryRequest) -> StoryResponse:
    try:
        if data.subject.lower().strip() == "test":
            # Return a random existing story/speech URL
            return StoryResponse(
                story_filename = f"the_role_of_touch_in_emotional_connection.txt",
                story_url = f"static/audio/generated_stories/text/the_role_of_touch_in_emotional_connection.txt",
                speech_url = f"static/audio/generated_stories_audio/the_role_of_touch_in_emotional_connection.mp3",
                track_url = f"static/audio/local_ambient_tracks/abstract_aprils_hold.mp3",
                track_filename = "abstract_aprils_hold.mp3"
            )
        payload = build_story(data.subject)
        return StoryResponse(**payload, by_alias=True)
    except Exception as e:
        print(f"ERROR: {str(e)}")  # Log the error
        raise HTTPException(status_code=500, detail=str(e))

# loading endpoint for an existing story
@router.post("/check", response_model=StoryResponse)
async def check_story(data: StoryRequest) -> StoryResponse:
    try:
        payload = load_story(data.subject)
        return StoryResponse(**payload, by_alias=True)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load story: {str(e)}"
        )
