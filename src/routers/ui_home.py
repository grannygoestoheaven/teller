from pathlib import Path
from fastapi import APIRouter
from fastapi.responses import HTMLResponse

BASE_DIR = Path(__file__).parent.parent.parent  # Adjust based on your project structure
HTML_PATH = BASE_DIR / "static" / "templates" / "index_2.html"

router = APIRouter()

@router.get("/")
async def serve_index():
    return HTMLResponse(content=(HTML_PATH).read_text())
