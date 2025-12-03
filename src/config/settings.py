import os
import re
import shutil

from pydantic_settings import BaseSettings
from pydantic import Field
from pathlib import Path

print("entering settings.py")

# Root directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent
print(f"BASE_DIR set to: {BASE_DIR}")

# Directories for storing generated stories
STATIC_DIR = BASE_DIR / "static"
GENERATED_STORIES_DIR = STATIC_DIR / "stories"

# Local Tracks
LOCAL_TRACKS_DIR = STATIC_DIR / "audio" / "local_ambient_tracks"

# Story settings
DEFAULT_DURATION = 1
PATTERN_FILE_PATH = 'src/config/patterns/default_narrative.md'

class EnvSettings(BaseSettings):
    # API keys for external services
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    mistral_api_key: str = Field(..., env="MISTRAL_API_KEY")
    elevenlabs_api_key: str = Field(..., env="ELEVEN_LABS_API_KEY")

    class Config:
        env_file = ".env"

env_settings = EnvSettings()
