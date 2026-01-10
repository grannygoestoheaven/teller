from pathlib import Path
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

# Initialize router and templates
router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/", response_class=HTMLResponse)
async def serve_index(request: Request):
    return templates.TemplateResponse(
        "index_2.html",
        {"request": request}  # Required for Jinja2 URL generation
    )

@router.get("/main_fields")
async def get_main_fields():
    return {"main_fields": list(fields_data.keys())}
