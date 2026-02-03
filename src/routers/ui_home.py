from pathlib import Path
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from src.schemas.story import StoryRequest, StoryResponse, StoryCheckResponse
from src.services.build import create_subjects, load_field_subjects

# Initialize router and templates
router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/", response_class=HTMLResponse)
async def serve_index(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}  # Required for Jinja2 URL generation
    )

@router.post("/user_topic")
async def get_subjects(data: StoryRequest):
    try:
        topic = data.topic
        print(f"Hello Server {data.topic}")  # Debug print to verify topic
        payload = create_subjects(topic) # the build story function generates both text then sends it to tts.
        print(f"Payload from create_subjects: {payload}")  # Debug print to verify payload
        
        return payload
    
    except Exception as e:
        print(f"ERROR: {str(e)}")  # Log the error
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/check_field")
async def check_field(data: StoryRequest):
    try:
        field = data.field

        field_dir_path = STATIC_DIR / fields / f"{field}.js"

        if not field_dir_path.exists():
            return {"exists": False, "fields": None}

        payload = load_field_subjects(field) # The load field function holds the condition to generate tts if missing.
        
        return {"exists": True, "field": payload}
    
    except Exception as e:
        print(f"ERROR: {str(e)}")  # Log the error
        raise HTTPException(status_code=500, detail=str(e))
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)})
