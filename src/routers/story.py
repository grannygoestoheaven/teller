import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from src.schemas.story import StoryRequest, StoryResponse, StoryCheckResponse
from src.services.utils import _format_text_filename
from src.services.build import build_story, load_story
from src.config.settings import BASE_DIR, STATIC_DIR, DEFAULT_PROMPT_PATH

router = APIRouter()

# generation endpoint for an unexisting story
@router.post("/new", response_model = StoryResponse)
def teller_story(data: StoryRequest) -> StoryResponse:
    try:
        subject = data.subject
        print(f"Hello Server {subject}")  # Debug print to verify subject
        narrative_style = data.narrative_style or DEFAULT_PROMPT_PATH
        print(DEFAULT_PROMPT_PATH) # Debug print to verify prompt content
        difficulty = data.difficulty or "beginner"
        
        if data.subject.lower().strip() == "test":
            # Return a random existing story/speech URL
            return StoryResponse(
                story_filename = f"the_role_of_touch_in_emotional_connection.txt",
                story_title = f"The Role of Touch in Emotional Connection",
                story = f"static/audio/generated_stories/{subject}/the_role_of_touch_in_emotional_connection.txt",
                speech_url = f"static/audio/generated_stories_audio/the_role_of_touch_in_emotional_connection.mp3",
                track_url = f"static/audio/local_ambient_tracks/abstract_aprils_hold.mp3",
                track_filename = "abstract_aprils_hold.mp3"
            )
        
        payload = build_story(subject, narrative_style, difficulty) # the build story function generates both text then sends it to tts.

        return StoryResponse(**payload, by_alias=True)
    
    except Exception as e:
        print(f"ERROR: {str(e)}")  # Log the error
        raise HTTPException(status_code=500, detail=str(e))

# loading endpoint for an existing story
@router.post("/check", response_model=StoryCheckResponse)
async def check_story(data: StoryRequest) -> StoryCheckResponse:
    try:
        subject = data.subject

        filename = _format_text_filename(subject)
        json_path = STATIC_DIR / "stories" / filename / f"{filename}.json"
        mp3_path = STATIC_DIR / "stories" / filename / f"{filename}.mp3"

        if not json_path.exists():
            return {"exists": False, "story": None}

        payload = load_story(subject, regenerate_mp3=True) # The load story function holds the condition to generate tts if missing.
        
        return {"exists": True, "story": StoryResponse(**payload, by_alias=True)}
    
    except Exception as e:
        print(f"ERROR: {str(e)}")  # Log the error
        raise HTTPException(status_code=500, detail=str(e))
