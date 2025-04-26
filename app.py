import os
import gradio as gr
import spaces
import torch

from dotenv import load_dotenv

# from src.config import patterns
# from src.data.get_track_duration import extract_service_name
# from src.services.get_story_length import get_user_story_lengt
# from src.services.generate_story import generate_story
# from src.services.text_to_speech import openai_text_to_speech
# from src.services.play_audio import play_audio, play_audio_with_sync

# from teaicher.config import patterns
from src.teaicher.data.get_track_duration import extract_service_name
from src.teaicher.services.get_story_length import get_user_story_length
from src.teaicher.services.generate_story import generate_story
from src.teaicher.services.text_to_speech import openai_text_to_speech
from src.teaicher.services.play_audio import play_audio, play_audio_with_sync

# Load .env
load_dotenv()

# UI callback
def generate_story_app(subject, user_length, track_url):
    with open('src/config/patterns/insightful_brief.md', 'r') as file:
        pattern = file.read()

    estimated_chars = get_user_story_length(user_length)
    pattern = pattern.replace("{subject}", subject).replace("{estimated_chars}", str(estimated_chars))

    story = generate_story(subject, pattern, estimated_chars)
    audio_path = openai_text_to_speech(story)

    if track_url:
        play_audio_with_sync(track_url, audio_path)
    else:
        play_audio(audio_path)

    return story, audio_path

# Gradio UI
gr.Interface(
    fn=generate_story_app,
    inputs=[
        gr.Textbox(label="Subject"),
        gr.Number(label="Length (in seconds)"),
        gr.Textbox(label="Track URL (optional)")
    ],
    outputs=[
        gr.Textbox(label="Generated Story"),
        gr.Audio(label="Generated Speech")
    ],
    title="teaicher"
).launch()
