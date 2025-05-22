import os
import math  # For character-to-token conversion
import re

from dotenv import load_dotenv
from openai import OpenAI
from openai.types.responses import web_search_tool  # OpenAI API client
from mistralai import Mistral, UserMessage  # Import the correct class

load_dotenv()

def _sanitize_filename(text: str) -> str:
    """
    Sanitizes a string to be used as a safe filename.
    Replaces non-alphanumeric characters (except dashes and underscores) with underscores,
    and limits the length.
    """
    # Replace any non-alphanumeric, non-space characters with an empty string
    # This also removes the '/' character
    sanitized = re.sub(r'[^\w\s-]', '', text).strip()
    # Replace spaces and multiple dashes/underscores with a single underscore
    sanitized = re.sub(r'[\s_-]+', '_', sanitized)
    # Ensure it's not too long and is lowercase
    return sanitized[:100].lower() # Limit length to 100 characters, convert to lowercase

def generate_story(subject, pattern, estimated_chars: int) -> tuple[str, str]:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    # Use Chat Completions API instead of Responses API
    response = client.chat.completions.create(
        model="gpt-4",  # Using gpt-4 instead of gpt-4o for better reliability
        messages=[
            {"role": "system", "content": pattern},
            {"role": "user", "content": subject}
        ],
        temperature=0.7,
    )
    
    # Extract the content from the response
    output_text = response.choices[0].message.content.strip()
    
    # Split into title and story
    if "\n" in output_text:
        full_output = output_text.split("\n", 1)
        raw_title = full_output[0].strip()
        story = full_output[1].strip()
    else:
        # Fallback if no newline is found
        raw_title = subject[:50]  # Use first 50 chars of subject as title
        story = output_text
    
    # Sanitize the filename
    filename = _sanitize_filename(raw_title) + ".mp3"
    
    return story, filename

def generate_story_strict(subject, pattern, estimated_chars: int) -> tuple[str, str]:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    max_retries = 3
    strict_instruction = "\n\nIMPORTANT: Return your answer as: <title>\\n<story>. Do NOT add any other text, explanations, or formatting. Only output the title, then a single newline, then the story."
    for attempt in range(max_retries):
        # Always append the strict instruction
        if strict_instruction not in pattern:
            prompt = pattern.strip() + strict_instruction
        else:
            prompt = pattern
        response = client.responses.create(
            model="gpt-4o",
            input=subject,
            instructions=prompt,
            tools=[{"type": "web_search_preview"}],
        )
        output_text = response.output_text.strip()
        if "\n" in output_text:
            full_output = output_text.split("\n", 1)
            raw_title = full_output[0]
            story = full_output[1].strip()
            break
        else:
            print(f"[generate_story][attempt {attempt+1}] No newline found in output: {output_text}")
            # Make the instruction even stricter for the next attempt
            pattern = prompt + "\n\nAGAIN: Only output the title, then a single newline, then the story. Do NOT add anything else."
    else:
        raw_title = "Error"
        story = "Failed to generate story after several attempts. AI did not return expected output."
    filename = raw_title.lower() + ".mp3"

    return story, filename

def generate_story_mistral(subject, pattern, estimated_chars: int) -> tuple[str, str]:
    api_key = os.environ.get("MISTRAL_API_KEY")
    model_name = "open-mixtral-8x7b"

    # Instantiate the correct class
    client = Mistral(api_key=api_key)

    messages = [
        {"role": "system", "content": pattern},
        {"role": "user", "content": subject}
    ]

    try:
        chat_response = client.chat.complete(
            model=model_name,
            messages=messages,
            # Add other parameters like temperature, max_tokens if needed
            # max_tokens can be roughly estimated from estimated_chars if necessary
        )

        if chat_response.choices and len(chat_response.choices) > 0:
            full_output = chat_response.choices[0].message.content.strip().split("\n", 1)
            if len(full_output) >= 2:
                raw_title = full_output[0]
                story = full_output[1].strip()
            elif len(full_output) == 1:
                raw_title = subject # Or a generic title
                story = full_output[0].strip()
            else:
                raw_title = subject
                story = "Could not generate story content."
            
            filename = raw_title.lower().replace(" ", "_") + ".mp3"
            filename = "".join(c for c in filename if c.isalnum() or c in ('.', '_')).rstrip()
            if not filename.endswith(".mp3"):
                filename += ".mp3"
            if len(filename) > 200: 
                filename = filename[:200] + ".mp3"
            if filename == ".mp3": 
                filename = "mistral_story.mp3"

            return story, filename
        else:
            return "Mistral API did not return a valid choice.", "error.mp3"

    except Exception as e:
        print(f"Error calling Mistral API: {e}")
        return f"Error generating story with Mistral: {e}", "error.mp3"
