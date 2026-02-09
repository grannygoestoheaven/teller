from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from pathlib import Path

from src.routers import ui_home, topic, story
from src.config.settings import env_settings, load_prompts

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])
# app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/static/{file_path:path}")
async def serve_static(file_path: str):
    return FileResponse(
        Path("static") / file_path,
        headers={"Access-Control-Allow-Origin": "*"}
    )

app.include_router(ui_home.router)
app.include_router(topic.router, prefix="/v1/topic")
app.include_router(story.router, prefix="/v1/stories")

@app.on_event("startup")
def startup_event():
    load_prompts()  # Load all prompts once at startup

print("Server running at: http://127.0.0.1:8080")
