from fastapi import APIRouter
from fastapi.responses import JSONResponse

from src.schemas.story import StoryRequest, StoryResponse
from src.services.build import build_story

router = APIRouter()

@router.post("/new", response_model = StoryResponse)
def teller_story(data: StoryRequest) -> StoryResponse:
    try:
        if data.subject.lower().strip() == "test":
            # Return a random existing story/speech URL
            return {"storyFilename": f"the_role_of_touch_in_emotional_connection.txt",
                    "StoryUrl": f"static/audio/generated_stories/text/the_role_of_touch_in_emotional_connection.txt",
                    "speechUrl": f"static/audio/generated_stories_audio/the_role_of_touch_in_emotional_connection.mp3",
                    "trackUrl": f"static/audio/local_ambient_tracks/abstract_aprils_hold.mp3"}
        payload = build_story(data.subject)
        return JSONResponse(payload)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
