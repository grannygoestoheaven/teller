from pydantic import BaseModel, Field

class TtsRequest(BaseModel):
    text: str
    