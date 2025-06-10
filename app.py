import os
import gradio as gr
import torch
from flask import Flask, send_from_directory
import pathlib

# Check if running on Hugging Face Spaces
if os.environ.get('SPACE_ID') is not None:
    try:
        import spaces # Or whatever the correct import is
        # Use spaces features here
        print("Running on HF Spaces, imported 'spaces'")
    except ImportError:
        print("Running on HF Spaces, but 'spaces' import failed.")
else:
    print("Running locally.")
    try:
        # Local-specific code or simply skip Spaces features
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        print("Running locally, but 'dotenv' not installed. Please install it (`pip install python-dotenv`).")

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
    estimated_chars = get_user_story_length(user_length)
    track_path = "/Users/grannygoestoheaven/code/computer science projects/teaicher/src/static/audio/Leaf_Bed.mp3"
    with open('src/teaicher/config/patterns/insightful_brief.md', 'r') as file:
        pattern = file.read().replace("{subject}", str(subject)).replace("{estimated_chars}", str(estimated_chars))
        story, filename = generate_story(subject, pattern, estimated_chars)
        speech_file_path = openai_text_to_speech(story)
    if track_url:
        play_audio_with_sync(speech_file_path, track_url)
    else:
        play_audio_with_sync(speech_file_path, track_path)

    return story

# Create a Flask app for serving static files
app = Flask(__name__)

# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# Create a custom Gradio app with the Flask app
gr.mount_gradio_app(app, gr.Interface(
    fn=generate_story_app,
    inputs=[
        gr.Textbox(label="Subject"),
        gr.Number(label="Length (in minutes)"),
        gr.Textbox(label="Track URL (optional)")
    ],
    outputs=[
        gr.Textbox(label="Generated Story"),
        # gr.Audio(label="Generated Speech")
    ],
    title="teller",
    allow_flagging="never"
), path="/")

# Run the app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)
