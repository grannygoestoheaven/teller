import math  # For character-to-token conversion
import re

from fastapi import APIRouter
from pydantic import BaseModel

from mistralai import Mistral
from openai import OpenAI

from src.config.settings import env_settings
from src.services.utils import _clean_story_text, _format_text_filename, _clean_story_title

client = OpenAI(api_key=env_settings.openai_api_key)

def generate_story_with_openai(subject) -> tuple[str, str]:
    # Format the pattern by replacing placeholders
    system_message = """
    # IDENTITY AND PURPOSE:
    You are an expert on writing concise, clear, and sparkling presentation on the {subject} provided.
    
      ## STYLE AND TONE:
    - FORBIDDEN words = ["crucial", "essential", "critical", "fundamental", "paramount", "key", insight, valuable, groundbreaking, cutting-edge, innovative, pioneering, transformative, revolutionary, unprecedented, remarkable, extraordinary, fascinating, captivating, enthralling, mesmerizing, spellbinding, riveting, compelling, tapestry].
    - DO NOT repeat words.
    - NEVER MAKE ASSUMPTIONS. NEVER MAKE FREE CLAIMS, EVEN INOFFENSIVE. YOU DO NOT SAY IF YOU DON'T KNOW.
    - Write in an elegant style, not in a grandiose style. Avoid any mystery tone at all cost.
    - Do not use cliches or jargon.
    - Use absolutely ZERO cliches or jargon or journalistic language like "In a world, in the realm", etc.
    - USE ZERO poetry of any kind.
    - Use ZERO metaphor of any kind.
    - use ZERO common setup language in any sentence, including: in conclusion, in closing, etc.
    - Do not output warnings or notes—just the output requested."""
    
    # Create a clear instruction for the AI
    user_message =f"""
    # INSTRUCTIONS:
    
    ## OUTPUT: 850 chars MAXIMUM.
    
    Please generate a presentation about: {subject}
    - Focus specifically on: {subject}
    - Be factual, clear and precise. No generalities.
    - Make the text four paragraphs long.
    - Initiate the text with a soft, quiet opening e.g. with a raw list of TWO of the concepts that will be covered in the story. **always pick concepts slighlty more unexpected than normal**.
    - Always add a new line after the opening.
    - add <[silence]> tags between all sentences and between each new line.
    - Conclude by suggesting three related subjects to the topic, in variations of this kind : "Three related subjects are...". Don't write anything after that.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.2,
            max_tokens=600,
            top_p=0.9
        )

        print(f"Response from OpenAI: {response}")
        tagged_story_for_tts = response.choices[0].message.content.strip() if response else "" # get the story text with punctuation tags
        print(f"Generated tagged story for TTS: {tagged_story_for_tts}")
        clean_story = _clean_story_text(tagged_story_for_tts) # remove punctuation tags to have a clean version to display
        clean_story_title = _clean_story_title(subject)
       
        return clean_story_title, tagged_story_for_tts, clean_story
    
    except Exception as e:
        print(f"Error in generating_story: {str(e)}")
        error_title = f"Error generating story about {subject}"
        error_story = "We encountered an error while generating the story. Please try again."
        
        return error_story, _format_text_filename(error_title) + ".mp3"
