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
FIELDS_DIR = STATIC_DIR / "fields"
GENERATED_STORIES_DIR = STATIC_DIR / "stories"

# Directories for retrieval augmented generation sources
NEWS_SOURCES = {"science": ["https://api.nature.com/headlines"],
                "politics": ["https://api.reuters.com/latest"],
                "weather": "" }

# Local Tracks
LOCAL_TRACKS_DIR = STATIC_DIR / "audio" / "local_ambient_tracks"

# Remaining subjects list

# Fields and subjects
DEFAULT_FIELDS = STATIC_DIR / "fields" / "defaultFieldsSmall.js"

# Story settings
DEFAULT_DURATION = 1

PROMPTS_DIR = BASE_DIR / "src" / "config" / "patterns"
# DEFAULT_PROMPT_PATH = BASE_DIR / "src" / "config"/ "patterns" / "default_narrative.md"
# DEFAULT_PROMPT_PATH = BASE_DIR / "src" / "config"/ "patterns" / "brutal_facts.md"
DEFAULT_PROMPT_PATH = BASE_DIR / "src" / "config"/ "patterns" / "precision_narrative_engine.md"
# DEFAULT_PROMPT_PATH = BASE_DIR / "src" / "config"/ "patterns" / "pn_engine_moderate_pace.md"
# DEFAULT_PROMPT_PATH = BASE_DIR / "src" / "config"/ "patterns" / "random_words.md"
# DEFAULT_PROMPT_PATH = BASE_DIR / "src" / "config"/ "patterns" / "pne_no_tags.md"
# DEFAULT_PROMPT_PATH = BASE_DIR / "src" / "config"/ "patterns" / "schizophrenic.md"

DEFAULT_PROMPT = DEFAULT_PROMPT_PATH.read_text()

PROMPTS = {}  # {"narrative_style": "template...", "other_narrative_style": "template..."} filled with load_prompts() see below.

class EnvSettings(BaseSettings):
    # API keys for external services
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    mistral_api_key: str = Field(..., env="MISTRAL_API_KEY")
    elevenlabs_api_key: str = Field(..., env="ELEVEN_LABS_API_KEY")
    newsapi_api_key: str = Field(..., env="NEWSAPI_API_KEY")
    
    use_bucket: bool = Field(default=False, env="USE_BUCKET")  # Defaults to local
    scw_bucket_name: str = Field(default="", env="SCW_BUCKET_NAME")
    scw_access_key: str = Field(default="", env="SCW_ACCESS_KEY")
    scw_secret_key: str = Field(default="", env="SCW_SECRET_KEY")
    scw_endpoint: str = Field(default="", env="SCW_ENDPOINT")

    class Config:
        env_file = ".env"

env_settings = EnvSettings()

def load_prompts():
    patterns_dir = PROMPTS_DIR
    for md_file in patterns_dir.glob("*.md"):
        style_name = md_file.stem  # stem gets the filename without suffix
        with open(md_file, "r") as f:
            PROMPTS[style_name] = f.read()
    print(PROMPTS.keys()) # Debug print to verify prompts are loadedf
