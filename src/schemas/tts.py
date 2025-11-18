from fastapi import BaseModel

class TtsRequest(BaseModel):
    text: str
    