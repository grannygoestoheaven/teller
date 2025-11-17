from pydantic import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str
    mistral_api_key: str
    youtube_api_key: str
    spotify_api_key: str
    
    class Config:
        env_file = ".env"
