from pydantic import BaseModel, Field

# text and audio schemas request
class StoryRequest(BaseModel):
    subject: str

# text and audio schemas response
class StoryResponse(BaseModel):
    story_filename: str = Field(alias="storyFilename")  # Raw filename
    story_clean: str = Field(alias="storyText")        # Raw clean story text
    speech_url: str = Field(alias="speechUrl")          # URL to speech
    track_url: str = Field(alias="trackUrl")            # URL to track
    track_filename: str = Field(alias="trackFilename")  # Raw track filename
    
    class Config:
        populate_by_name = True
        validate_by_name = True

class StoryCheckResponse:
    exists: bool
    story: optional[StoryResponse] = None
