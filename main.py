from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from src.routers import ui_home, story

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(story.router, prefix="/v1/stories")
app.include_router(ui_home.router)

print("Server running at: http://127.0.0.1:8000")
