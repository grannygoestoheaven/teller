from pydantic_settings import BaseSettings
from pydantic import Field
from pathlib import Path

# Root directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Directories for storing generated stories
STATIC_AUDIO_DIR = BASE_DIR / "static" / "audio"
SUB_AUDIO_DIR = "generated_stories_audio"
GENERATED_STORIES_AUDIO_DIR = STATIC_AUDIO_DIR / SUB_AUDIO_DIR

STATIC_TEXT_DIR = BASE_DIR / "static" / "text"
SUB_TEXT_DIR = "jsonStories"
GENERATED_STORIES_TEXT_DIR = STATIC_TEXT_DIR / SUB_TEXT_DIR

# Story settings
DEFAULT_DURATION = 1
PATTERN_FILE_PATH = 'src/config/patterns/default_narrative.md'

# Local Tracks
LOCAL_TRACKS_DIR = STATIC_AUDIO_DIR / "local_ambient_tracks"

class EnvSettings(BaseSettings):
    # API keys for external services
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    mistral_api_key: str = Field(..., env="MISTRAL_API_KEY")
    elevenlabs_api_key: str = Field(..., env="ELEVEN_LABS_API_KEY")
       
    class Config:
        env_file = ".env"

env_settings = EnvSettings()
