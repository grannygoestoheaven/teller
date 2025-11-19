from pydantic import BaseModel

# text and audio schemas request
class StoryRequest(BaseModel):
    subject: str

# text and audio schemas response
class StoryResponse(BaseModel):
    text: str
    audio_url: str
