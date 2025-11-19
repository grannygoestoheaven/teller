from pydantic import BaseModel

class TtsRequest(BaseModel):
    text: str
    