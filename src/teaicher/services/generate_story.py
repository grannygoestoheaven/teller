import os
import math  # For character-to-token conversion
import re

from dotenv import load_dotenv
from openai import OpenAI
from openai.types.responses import web_search_tool  # OpenAI API client
from mistralai import Mistral, UserMessage  # Import the correct class

load_dotenv()

# def _sanitize_filename(text: str) -> str:
#     """
#     Sanitizes a string to be used as a safe filename.
#     Replaces non-alphanumeric characters (except dashes and underscores) with underscores,
#     and limits the length.
#     """
#     # Replace any non-alphanumeric, non-space characters with an empty string
#     # This also removes the '/' character
#     sanitized = re.sub(r'[^\w\s-]', '', text).strip()
#     # Replace spaces and multiple dashes/underscores with a single underscore
#     sanitized = re.sub(r'[\s_-]+', '_', sanitized)
#     # Ensure it's not too long and is lowercase
#     return sanitized[:100].lower() # Limit length to 100 characters, convert to lowercase

def generate_story(subject, pattern, estimated_chars: int) -> tuple[str, str]:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    # Format the pattern by replacing placeholders
    system_message = pattern.replace('{subject}', subject).replace('{estimated_chars}', str(estimated_chars))
    
    # Create a clear instruction for the AI
    user_message = f"""Please generate a presentation about: {subject}
    - Keep it around {estimated_chars} characters long
    - Focus specifically on: {subject}
    - Be factual, clear and precise. No generalities.
    - Make the text four paragraphs long.
    - Initiate the text with a soft, quiet opening e.g. with a raw list of a few concepts that will be covered in the story. **always pick concepts slighlty more unexpected than normal**.
    - Always add a new line after the opening.
    - add <[silence]> tags between all sentences and between each new line.
    - Conclude by suggesting three related subjects to the topic, in variations of this kind : "Three related subjects are...". Don't write anything after that.
    
    ## Instructions :
    - Write in an elegant style, not in a grandiose style. Avoid any mystery tone at all cost.
    - Do not use cliches or jargon.
    - Use absolutely ZERO cliches or jargon or journalistic language like "In a world, in the realm", etc.
    - Forbidden extreme words = "crucial", "essential", "critical", "fundamental" etc.
    - USE ZERO poetry of any kind.
    - Use ZERO metaphor of any kind.
    - use ZERO common setup language in any sentence, including: in conclusion, in closing, etc.
    - Do not output warnings or notes—just the output requested."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.4,
            max_tokens=1300
        )
        
        # Get the story content
        # story = response.choices[0].message.content.strip()
        story = response.choices[0].message.content
        
        # Use the original subject for the filename, not the AI-generated title
        filename = _sanitize_filename(subject)
        
        return story, filename
        
    except Exception as e:
        print(f"Error in generate_story: {str(e)}")
        # Return a default error response
        error_title = f"Error generating story about {subject}"
        error_story = "We encountered an error while generating the story. Please try again."
        return error_story, _sanitize_filename(error_title) + ".mp3"
    
def generate_story_cognitive_boost(subject, pattern) -> tuple[str, str]:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    # Format the pattern by replacing placeholders
    system_message = pattern.replace('{subject}', subject)
    user_message = f"Write a TTS story about '{subject}' following the system instructions."
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.4,
            max_tokens=1300
        )
        
        # Get the story content
        # story = response.choices[0].message.content.strip()
        story = response.choices[0].message.content
        
        # Use the original subject for the filename, not the AI-generated title
        filename = _sanitize_filename(subject)
        
        return story, filename
        
    except Exception as e:
        print(f"Error in generate_story: {str(e)}")
        # Return a default error response
        error_title = f"Error generating story about {subject}"
        error_story = "We encountered an error while generating the story. Please try again."
        return error_story, _sanitize_filename(error_title) + ".mp3"

def _sanitize_filename(raw_title: str, max_length: int = 200) -> str:
    """Generate a sanitized filename from a raw title."""
    if not raw_title or not isinstance(raw_title, str):
        return "mistral_story.mp3"
        
    # Convert to lowercase and replace spaces
    filename = raw_title.lower().replace(" ", "_")
    # Remove any non-alphanumeric characters except dots and underscores
    filename = "".join(c for c in filename if c.isalnum() or c in ('.', '_')).rstrip()
    
    # Ensure .mp3 extension
    if not filename.endswith(".mp3"):
        filename += ".mp3"
    
    # Handle edge cases
    if len(filename) > max_length:
        filename = filename[:max_length - 4] + ".mp3"
    if filename == ".mp3":
        return "mistral_story.mp3"
        
    return filename

def generate_story_mistral(subject: str, pattern: str, estimated_chars: int) -> tuple[str, str]:
    """Generate a story using Mistral's API.
    fff
    Args:
        subject: The subject of the story
        pattern: System prompt/pattern for the model
        estimated_chars: Estimated length in characters (for reference)
        
    Returns:
        tuple: (story_text, output_filename)
    """
    try:
        # Initialize client and make API call
        client = Mistral(api_key=os.environ.get("MISTRAL_API_KEY"))
        response = client.chat.complete(
            model="open-mixtral-8x7b",
            messages=[
                {"role": "system", "content": pattern},
                {"role": "user", "content": subject}
            ]
        )

        # Process response
        if not response.choices:
            return "Mistral API did not return any choices.", "error.mp3"
            
        content = response.choices[0].message.content.strip()
        if not content:
            return "Received empty response from Mistral API.", "error.mp3"
        
        # Split title and story content
        parts = content.split("\n", 1)
        title = parts[0] if len(parts) > 1 else subject
        story = parts[1].strip() if len(parts) > 1 else content
        
        return story, _sanitize_filename(title)
        
    except Exception as e:
        error_msg = f"Error calling Mistral API: {str(e)}"
        print(error_msg)
        return error_msg, "error.mp3"
