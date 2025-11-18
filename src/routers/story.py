from fastapi import APIRouter
from fastapi.responses import JSONResponse

from src.routers.schemas.story import StoryRequest, StoryResponse
from src.services.story.story_service import build_story

router = APIRouter(prefix = "/v1/stories")

@router.post("/new", response_model = StoryResponse)
def teller_story(data: StoryRequest) -> StoryResponse:
    payload = build_story(data.subject)
    return JSONResponse(payload)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)