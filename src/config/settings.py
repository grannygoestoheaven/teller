from pydantic import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    mistral_api_key: str = Field(..., env="MISTRAL_API_KEY")
    youtube_api_key: str = Field(..., env="YOUTUBE_API_KEY")
    spotify_api_key: str = Field(..., env="SPOTIFY_API_KEY")
    
    STATIC_AUDIO_DIR = Path("static/audio")
    SUB_AUDIO_DIR = "generated_stories_audio"
    GENERATED_STORIES_AUDIO = STATIC_AUDIO_DIR / SUB_AUDIO_DIR
    
    STATIC_TEXT_DIR = Path("static/text")
    SUB_TEXT_DIR = "text"
    GENERATED_STORIES_TEXT = STATIC_TEXT_DIR / SUB_TEXT_DIR
    
    class Config:
        env_file = ".env"

settings = Settings()
