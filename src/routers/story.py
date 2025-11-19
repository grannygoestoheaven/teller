from fastapi import APIRouter
from fastapi.responses import JSONResponse

from src.schemas.story import StoryRequest, StoryResponse
from src.services.build import build_story

router = APIRouter()

@router.post("/new", response_model = StoryResponse)
def teller_story(data: StoryRequest) -> StoryResponse:
    try:
        payload = build_story(data.subject)
        return JSONResponse(payload)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
