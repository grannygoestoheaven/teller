import os
from dotenv import load_dotenv
from flask import Flask, render_template, request

from src.teaicher.data.get_track_duration import get_track_duration, extract_service_name
from src.teaicher.services.get_story_length import get_user_story_length
from src.teaicher.services.generate_story import generate_story
from src.teaicher.services.text_to_speech import openai_text_to_speech
from src.teaicher.services.play_audio import play_audio, play_audio_with_sync, play_audio_with_stereo_effect

app = Flask(__name__)
load_dotenv()

@app.route('/')
def index():
    return render_template('index_4.html')

@app.route('/generate_story', methods=['POST'])
def generate_story_ui():
    subject = request.form['subject']
    user_length = int(request.form['duration'])
    track_path = "/Users/grannygoestoheaven/code/computer science projects/teaicher/src/static/audio/Leaf_Bed.mp3"

    estimated_chars = get_user_story_length(user_length)
    with open('src/teaicher/config/patterns/insightful_brief.md', 'r') as file:
        pattern = file.read().replace("{subject}", str(subject)).replace("{estimated_chars}", str(estimated_chars))

    story, filename = generate_story(subject, pattern, estimated_chars)
    speech_file_path = openai_text_to_speech(story)
    play_audio_with_sync(speech_file_path, track_path)
    # play_audio_with_stereo_effect(speech_file_path, track_path)

    return render_template("index_4.html", story=story, audio_link=filename)

if __name__ == "__main__":
    app.run(debug=True)