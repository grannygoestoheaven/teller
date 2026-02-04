from pydantic import BaseModel, Field
from typing import Optional

class TopicRequest(BaseModel):
    topic: str

class TopicCheckResponse(BaseModel):
    topic_filename: str = Field(alias="topicFilename")
    topic: str = Field(alias="topic")

        class Config:
        populate_by_name = True
        validate_by_name = True
       