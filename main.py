from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from src.routers import ui_home, story
from src.config.settings import env_settings, load_prompts

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(story.router, prefix="/v1/stories")
app.include_router(ui_home.router)

@app.on_event("startup")
def startup_event():
    load_prompts()  # Load all prompts once at startup

print("Server running at: http://127.0.0.1:8000")
