import os
import math  # For character-to-token conversion

from dotenv import load_dotenv
from openai import OpenAI
from openai.types.responses import web_search_tool  # OpenAI API client

load_dotenv()

def generate_story(subject, pattern, estimated_chars: int) -> tuple[str, str]:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    response = client.responses.create(
        model="gpt-4o",
        input=subject,
        instructions=pattern,
        tools=[{"type": "web_search_preview"}],
        # tool_choice={"type": "web_search_preview"},   
    )

    full_output = response.output_text.strip().split("\n", 1)
    raw_title = full_output[0]
    story = full_output[1].strip()
    filename = raw_title.lower() + ".mp3"

    return story, filename
