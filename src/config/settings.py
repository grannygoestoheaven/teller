from pydantic import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    mistral_api_key: str = Field(..., env="MISTRAL_API_KEY")
    youtube_api_key: str = Field(..., env="YOUTUBE_API_KEY")
    spotify_api_key: str = Field(..., env="SPOTIFY_API_KEY")
    
    class Config:
        env_file = ".env"

settings = Settings()
