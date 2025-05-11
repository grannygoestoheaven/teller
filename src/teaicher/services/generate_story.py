import os
import math  # For character-to-token conversion

from dotenv import load_dotenv
from openai import OpenAI
from openai.types.responses import web_search_tool  # OpenAI API client

load_dotenv()

def generate_story(subject, pattern, estimated_chars: int) -> tuple[str, str]:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    response = client.responses.create(
        model="gpt-4.1",
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
            model="gpt-4.1",
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

# import os
# import json # Import the json library
# # import math # Not needed for this part
# from dotenv import load_dotenv
# from openai import OpenAI
# # from openai.types.responses import web_search_tool # Assuming this is still needed

# load_dotenv()

# def generate_story_json(subject, pattern, estimated_chars: int) -> tuple[str, str]:
#     client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

#     # IMPORTANT: Update the instructions (your 'pattern' variable)
#     # Tell the AI explicitly to output JSON with 'title' and 'story' keys.
#     # Example pattern update (you'll need to adjust your template/source for this):
#     # pattern = "Generate a short story based on the subject. Format the output as a JSON object with two keys: 'title' for the story title and 'story' for the story text."

#     try:
#         response = client.chat.completions.create( # Use chat.completions for structured output
#             model="gpt-4o", # gpt-4o or similar chat model recommended for JSON
#             response_format={ "type": "json_object" }, # Tell API to aim for JSON
#             messages=[ # Use messages format for chat models
#                 {"role": "system", "content": "You are a helpful assistant that generates stories in JSON format."},
#                 {"role": "user", "content": f"{pattern}\nSubject: {subject}"} # Combine pattern and subject
#                 # You might add estimated_chars to the prompt too, e.g., "Approx {estimated_chars} minutes long."
#             ],
#             # tools=[{"type": "web_search"}], # Or web_search_preview based on your needs
#             # tool_choice="auto" # Allow model to choose tools if needed
#         )

#         # Assuming the model puts the JSON in the first message's content
#         ai_output_string = response.choices[0].message.content.strip()

#         # Parse the JSON string
#         story_data = json.loads(ai_output_string)

#         # Extract title and story from the parsed JSON
#         raw_title = story_data.get("title", "Untitled Story") # Use .get() with default to be safe
#         story = story_data.get("story", "Could not generate story content.") # Use .get() with default

#     except json.JSONDecodeError as e:
#         print(f"Error parsing JSON from AI: {e}")
#         print(f"AI output: {ai_output_string}") # Log the raw output for debugging
#         raw_title = "Error"
#         story = "Failed to generate story due to invalid format from AI. Please try again."
#     except Exception as e:
#         print(f"An unexpected error occurred: {e}")
#         raw_title = "Error"
#         story = "An error occurred during story generation."


#     # Generate filename from the extracted title
#     # Make sure the title is clean for a filename
#     import re
#     clean_title = re.sub(r'[^a-zA-Z0-9_\-]', '', raw_title.lower().replace(" ", "_"))[:50] # Simple cleaning
#     if not clean_title: # Handle cases where title is empty or becomes empty after cleaning
#          clean_title = "generated_story"

#     filename = clean_title + ".mp3"


#     return story, filename