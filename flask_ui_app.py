import os
import random
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify

from src.teaicher.data.get_track_duration import get_track_duration, extract_service_name
from src.teaicher.services.get_story_length import get_user_story_length
from src.teaicher.services.generate_story import generate_story_strict 
from src.teaicher.services.text_to_speech import openai_text_to_speech 
from src.teaicher.services.play_audio import play_audio_with_sync 

app = Flask(__name__)
load_dotenv()

DEFAULT_DURATION = 1
PATTERN_FILE_PATH = 'src/teaicher/config/patterns/insightful_brief.md'
AMBIENT_SONGS_DIR_NAME = 'ambient_songs'

# helper functions for parameters, track selection, and story generation
def _prepare_story_parameters(request_form):
    subject = request_form['subject']
    duration_str = request_form.get('duration', str(DEFAULT_DURATION))
    try:
        duration = int(duration_str)
        if duration < 1:
            duration = 1
    except ValueError:
        duration = DEFAULT_DURATION
    estimated_chars = get_user_story_length(duration)
    return subject, duration, estimated_chars

def _get_ambient_track(base_dir, logger):
    ambient_dir = os.path.join(base_dir, 'static', 'audio', AMBIENT_SONGS_DIR_NAME)
    try:
        ambient_tracks_files = [f for f in os.listdir(ambient_dir) if f.endswith('.mp3')]
        if not ambient_tracks_files:
            logger.warning(f"No MP3 files found in {ambient_dir}. No ambient sound will be played.")
            return None
        track_filename = random.choice(ambient_tracks_files)
        return os.path.join(ambient_dir, track_filename)
    except FileNotFoundError:
        logger.error(f"Ambient songs directory not found: {ambient_dir}. No ambient sound will be played.")
        return None

def _generate_story_and_speech(subject, estimated_chars, pattern_path, logger):
    try:
        with open(pattern_path, 'r') as file:
            pattern = file.read().replace("{subject}", str(subject)).replace("{estimated_chars}", str(estimated_chars))
        story, filename = generate_story_strict(subject, pattern, estimated_chars)
        if story == "Error" or "Failed to generate story" in story: 
             logger.error(f"Story generation failed for subject '{subject}'. AI output: {story}")
             return None, None, None 
        speech_file_path = openai_text_to_speech(story)
        return story, filename, speech_file_path
    except FileNotFoundError:
        logger.error(f"Pattern file not found: {pattern_path}")
        return None, None, None
    except Exception as e:
        logger.error(f"An unexpected error occurred during story generation or TTS: {e}")
        return None, None, None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_story', methods=['POST'])
def teller_ui():
    subject, duration, estimated_chars = _prepare_story_parameters(request.form)
    
    app_base_dir = os.path.dirname(__file__)
    track_path = _get_ambient_track(app_base_dir, app.logger)

    story, filename, speech_file_path = _generate_story_and_speech(subject, estimated_chars, PATTERN_FILE_PATH, app.logger)

    if not story or not speech_file_path:
        error_message = "Sorry, there was an error generating the story or audio. Please try again."
        if not os.path.exists(PATTERN_FILE_PATH):
             error_message = "Sorry, the story pattern file is missing. Please contact support."

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
            return jsonify({"error": error_message}), 500
        else:
            return render_template("index.html", error=error_message), 500

    if speech_file_path and track_path:
        play_audio_with_sync(speech_file_path, track_path)
    elif speech_file_path:
        app.logger.info(f"Playing only speech file: {speech_file_path} as no ambient track was selected or found.")
        play_audio_with_sync(speech_file_path, None)
    else:
        app.logger.error("Speech file was not generated. Cannot play audio.")
        error_message = "Failed to generate audio for the story."
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
            return jsonify({"error": error_message}), 500
        else:
            return render_template("index.html", error=error_message), 500

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
        return jsonify({"story": story, "audio_link": filename})
    else:
        return render_template("index.html", story=story, audio_link=filename)

if __name__ == "__main__":
    app.run(debug=True)
