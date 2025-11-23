from pydantic import BaseModel, Field

# text and audio schemas request
class StoryRequest(BaseModel):
    subject: str

# text and audio schemas response
class StoryResponse(BaseModel):
    story_filename: str = Field(alias="storyFilename")
    story_url: str = Field(alias="StoryUrl")
    speech_url: str = Field(alias="speechUrl")
    track_url: str = Field(alias="trackUrl")
    
    class Config:
        populate_by_name = True
        allow_population_by_field_name = True
        
