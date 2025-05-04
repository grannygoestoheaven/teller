import os
import math  # For character-to-token conversion

from openai import OpenAI  # OpenAI API client
# from mistral import Mistral  # Mistral API client

def generate_story(subject, pattern, estimated_chars: int) -> tuple[str, str]:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    response = client.responses.create(
        model="gpt-4o",
        instructions=pattern,
        input=subject,
    )

    full_output = response.output_text.strip().split("\n", 1)
    raw_title = full_output[0]
    story = full_output[1].strip()
    filename = raw_title.lower() + ".mp3"

    return story, filename
