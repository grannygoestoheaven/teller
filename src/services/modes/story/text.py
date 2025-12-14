import os
import math  # For character-to-token conversion
import re

from fastapi import APIRouter
from pydantic import BaseModel

from mistralai import Mistral
from openai import OpenAI

from jinja2 import Template

from src.config.settings import env_settings
from src.services.utils import _clean_story_text, _format_text_filename, _clean_story_title

mistral_client = Mistral(api_key=env_settings.mistral_api_key)
openai_client = OpenAI(api_key=env_settings.openai_api_key)

def generate_story_with_mistralai(subject, narrative_style, difficulty) -> tuple[str, str]:
    print("entering Mistral story: ", subject, narrative_style, difficulty)
    try:
        # 1. Read the prompt template from the file
        with open(narrative_style, "r") as f:
            narrative_style_template = Template(f.read())
            print(f"narrative_style_temp: {narrative_style_template}")  # Debug print to verify template content
            narrative_style_rendered = narrative_style_template.render(
                subject = subject,
                difficulty = difficulty
            )

        print(f" Let's see : {narrative_style_rendered}")

        print(response = mistral_client.chat.complete(
            model="mistral-small-latest",
            messages=[
                {
                    "content": narrative_style_rendered,
                    "role": "system"
                },
                {
                    "content": "generate the text.",
                    "role": "user"
                },
                
            ],
            max_tokens=1100,
            temperature=0.7,
            presence_penalty=7.0,
            stream=False))
        
        print(response)

        if not response or not response.choices:
            raise ValueError("Empty response from Mistral API")
        
        print (response.choices[0].message.content)

        tagged_story_for_tts = response.choices[0].message.content if response else "" # get the story text with punctuation tags
        print(f"Generated tagged story for TTS: {tagged_story_for_tts}")
        clean_story = _clean_story_text(tagged_story_for_tts) # remove punctuation tags to have a clean version to display
        clean_story_title = _clean_story_title(subject)
    
        print(f"Returning: {clean_story_title}, {tagged_story_for_tts}, {clean_story}")
        return clean_story_title, tagged_story_for_tts, clean_story
    
    except Exception as e:
        print(f"Full error: {e[:10]}")  # Log both error and response
        raise  # Re-raise to see the traceback
        error_title = f"Error generating story about {subject}"
        error_story = "We encountered an error while generating the story. Please try again."
        
        return error_story, error_story, _format_text_filename(error_title) + ".mp3"

def generate_story_with_openai(subject, narrative_style: None, difficulty: None) -> tuple[str, str]:
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
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1200,
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

def generate_story_with_openai_jinja(subject, narrative_style: None, difficulty: None) -> tuple[str, str]:
    print("entering Mistral story: ", subject, narrative_style, difficulty)
    try:
        # 1. Read the prompt template from the file
        with open(narrative_style, "r") as f:
            narrative_style_template = Template(f.read())
            print(f"narrative_style_temp: {narrative_style_template}")  # Debug print to verify template content
            narrative_style_rendered = narrative_style_template.render(
                subject = subject,
                difficulty = difficulty
            )

        print(f" Let's see : {narrative_style_rendered}")

        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": narrative_style_rendered},
                {"role": "user", "content": "follow the system instructions and generate a text of 2500 characters."}
            ],
            temperature=0.1,
            max_tokens=2200,
            top_p=0.8
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