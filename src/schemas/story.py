from fastapi import BaseModel

# text and audio schemas request
class StoryRequest(BaseModel):
    subject: str
class TtsRequest(BaseModel):
    text: str

# text and audio schemas response
class TtsResponse(BaseModel):
    audio_url: str
class StoryResponse(BaseModel):
    text: str
    audio_url: str
