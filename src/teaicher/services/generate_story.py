import os
import math  # For character-to-token conversion
import re

from dotenv import load_dotenv
from mistralai import Mistral
from openai import OpenAI
from openai.types.responses import web_search_tool

from src.teaicher.services.text_utils import _sanitize_filename

load_dotenv()

def generate_story(subject, pattern, estimated_chars: int) -> tuple[str, str]:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    # cognitive_style_approach = pattern
    
    # Format the pattern by replacing placeholders
    system_message = "You are an expert on writing concise, clear, and factual presentation on the {subject} provided"
    
    # Create a clear instruction for the AI
    user_message =f"""Please generate a presentation about: {subject}
    - Focus specifically on: {subject}
    - keep it around {estimated_chars} characters long
    - Be factual, clear and precise. No generalities.
    - Make the text four paragraphs long.
    - Initiate the text with a soft, quiet opening e.g. with a raw list of a few concepts that will be covered in the story. **always pick concepts slighlty more unexpected than normal**.
    - Always add a new line after the opening.
    - add <[silence]> tags between all sentences and between each new line.
    - Conclude by suggesting three related subjects to the topic, in variations of this kind : "Three related subjects are...". Don't write anything after that.
    
    ## Unavoidable Instructions :
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
            max_tokens=1150,
        )
    
    # try:
    # # ** CHANGE 1: Use the Responses API endpoint **
    #     response = client.responses.create(
    #         model="gpt-4o",
    #         # CHANGE 2: Use the 'input' parameter for the user prompt
    #         input=user_message,
    #         instructions=system_message,
    #         temperature=0.4,
    #     )

        print(f"Response from OpenAI: {response}")
        # Get the story content
        story = response.choices[0].message.content.strip()
        # story = response.output_text
        
        # Use the original subject for the filename, not the AI-generated title
        filename = _sanitize_filename(subject)
        
        return story, filename
        
    except Exception as e:
        print(f"Error in generate_story: {str(e)}")
        # Return a default error response
        error_title = f"Error generating story about {subject}"
        error_story = "We encountered an error while generating the story. Please try again."
        return error_story, _sanitize_filename(error_title) + ".mp3"
    
def generate_news_with_mistral_chat(news_text: str, pattern: str, estimated_chars: int) -> tuple[str, str]:
    """
    Generates a factual, styled presentation using Mistral-Large,
    enabling premium web search for up-to-date and verified information.

    Args:
        subject: The core topic of the presentation (e.g., "AI ethics in 2025").
        pattern: The core system prompt/pattern for the model's behavior.
        
    Returns:
        tuple: (story_text, output_filename)
    """
    
    # 1. ENHANCE SYSTEM MESSAGE (INSTRUCTION TO USE TOOL)
    # The system message explicitly tells the model it has a tool and must use it.
    system_message = f"""{pattern}
    You are an expert on writing concise, clear, and factual news presentation on the {news_text} provided.
    
    Ensure all claims are grounded in the search results.
    - Focus specifically on: {subject}
    - Keep it around {estimated_chars} characters long.
    - Be factual, clear and precise. No generalities.
    - Make the text four paragraphs long.
    - Initiate the text with a soft, quiet opening (e.g., a raw list of a few slightly unexpected concepts that will be covered). **Always pick concepts slighlty more unexpected than normal.**
    - Always add a new line after the opening.
    - Add <[silence]> tags between all sentences and between each new line.
    - Conclude by suggesting three related subjects to the topic, in variations of this kind : "Three related subjects are...". Don't write anything after that.
    
    ## Unavoidable Instructions:
    - Write in an elegant style, not in a grandiose style. Avoid any mystery tone at all cost.
    - Do not use cliches or jargon.
    - Use absolutely ZERO cliches or jargon or journalistic language like "In a world, in the realm", etc.
    - Forbidden extreme words = "crucial", "essential", "critical", "fundamental" etc.
    - USE ZERO poetry of any kind.
    - Use ZERO metaphor of any kind.
    - use ZERO common setup language in any sentence, including: in conclusion, in closing, etc.
    - Do not output warnings or notes—just the output requested."""
    
    # 2. CONSTRUCT USER MESSAGE
    user_message =f"""Please generate faithful presentation about: {subject}"""

    try:
        # 3. MISTRAL AGENT API CALL
        client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
        response = client.chat.complete(
            model="mistral-medium-latest",
            messages=[
                {
                    "content": system_message,
                    "role": "system"
                },
                {
                    "content": user_message,
                    "role": "user"
                }
            ],
            frequency_penalty=0.1,
            temperature=0.4,
            max_tokens=1150,
        )

        if not response.choices:
            return "Mistral API did not return any outpus.", "error.mp3"
            
        content = response.choices[0].message.content.strip()
        if not content:
            return "Received empty response from Mistral API.", "error.mp3"
        
        # Use the original subject for the filename, not the AI-generated title
        filename = _sanitize_filename(subject)
        
        return content, filename
        
    except Exception as e:
        error_msg = f"Error calling Mistral API: {str(e)}"
        print(error_msg)
        return "We encountered an error while generating the story. Please try again.", "error.mp3"
    
def generate_news_with_mistral_agent(subject: str) -> tuple[str, str]:

    with Mistral(
        api_key=os.getenv("MISTRAL_API_KEY"),
    ) as mistral:

        res = mistral.agents.complete(messages=[
            {
                "SystemMessage": s
                "content": subject,
                "role": "user",
            },
        ], agent_id="<id>", stream=False)

        # Handle response
        return 
