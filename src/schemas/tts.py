from pydantic import BaseModel, Field

class TtsRequest(BaseModel):
    story_text: str
    