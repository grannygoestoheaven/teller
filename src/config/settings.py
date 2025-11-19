from pydantic_settings import BaseSettings
from pydantic import Field
from pathlib import Path

# Directories for storing generated stories
STATIC_AUDIO_DIR = Path("static/audio")
SUB_AUDIO_DIR = "generated_stories_audio"
GENERATED_STORIES_AUDIO = STATIC_AUDIO_DIR / SUB_AUDIO_DIR

STATIC_TEXT_DIR = Path("static/text")
SUB_TEXT_DIR = "text"
GENERATED_STORIES_TEXT = STATIC_TEXT_DIR / SUB_TEXT_DIR

# Story settings
DEFAULT_DURATION = 1
PATTERN_FILE_PATH = 'src/config/patterns/default_narrative.md'

# Local Tracks
LOCAL_TRACKS_DIR = STATIC_AUDIO_DIR / "local_ambient_tracks"

class Settings(BaseSettings):
    # API keys for external services
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    mistral_api_key: str = Field(..., env="MISTRAL_API_KEY")
    elevenlabs_api_key: str = Field(..., env="ELEVEN_LABS_API_KEY")
       
    class Config:
        env_file = ".env"

settings = Settings()
