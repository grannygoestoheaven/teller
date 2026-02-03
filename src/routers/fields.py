from pathlib import Path
from fastapi import APIRouter, Request

from src.services.build import generate_subjects, load_subjects

router = APIRouter()

@router.post("/check_topic")
async def check_topic(data: StoryRequest):
    try:
        topic = data.topic
        topic_dir_path = STATIC_DIR / topics / f"{topic}.js"

        if not topic_dir_path.exists():
            return {"exists": False, "topics": None}

        payload = load_subjects(topic) # The load topic function holds the condition to generate tts if missing.
        
        return {"exists": True, "topic": payload}
    
    except Exception as e:
        print(f"ERROR: {str(e)}")  # Log the error
        raise HTTPException(status_code=500, detail=str(e))
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)})

@router.post("/generate_subjects")
async def get_subjects(data: StoryRequest):
    try:
        topic = data.topic
        print(f"Hello Server {data.topic}")  # Debug print to verify topic
        payload = generate_subjects(topic) # the build story function generates both text then sends it to tts.
        print(f"Payload from generate_subjects: {payload}")  # Debug print to verify payload
        
        return payload
    
    except Exception as e:
        print(f"ERROR: {str(e)}")  # Log the error
        raise HTTPException(status_code=500, detail=str(e))
