import os
import re
import random
import glob
import json
import shutil
from datetime import datetime

from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, url_for

from src.services.generate_story_text import generate_story, generate_news_with_mistral_chat
from src.services.generate_tts import openai_text_to_speech
from src.services.store_story import save_story_to_server
from src.services.text_utils import _prepare_story_parameters, _clean_story_text, _sanitize_filename

app = Flask(__name__)

load_dotenv()

# --- Configuration Constants ---
DEFAULT_DURATION = 1
# PATTERN_FILE_PATH = 'src/config/patterns/abrupt.md'
# PATTERN_FILE_PATH = 'src/config/patterns/sensory_precision.md'
PATTERN_FILE_PATH = 'src/config/patterns/default_narrative.md'
LOCAL_AMBIENT_TRACKS_DIR = 'local_ambient_tracks'
YOUTUBE_AMBIENT_LANDSCAPES_DIR = 'youtube_ambient_landscapes' # Not used in current logic, kept for reference
YOUTUBE_AMBIENT_TRACKS_DIR = 'youtube_ambient_tracks'         # Not used in current logic, kept for reference

def _generate_story_and_speech(subject, estimated_chars, pattern_path, base_dir, logger):
    """
    Generates a story and speech, returning paths for both.
    Also selects an ambient track URL.
    """
    if subject == "test":
        with open("src/server_data/stories/20251108T225411Z_the_deja-vu_effect.json") as f:
            story_data = json.load(f)
            story_raw = story_data["raw"]
            story_cleaned = story_data["clean"]
        filename_from_story_gen = "eyewitness_testimony.mp3"
        speech_file_path_relative_to_static = "static/audio/generated_stories/the_precise_composition_of_dust.mp3"
        # track_url_for_client = ""
        track_url_for_client = "static/audio/local_ambient_tracks/abstract_aprils_hold.mp3"
        return story_raw, story_cleaned, filename_from_story_gen, speech_file_path_relative_to_static, track_url_for_client

    try:
        with open(pattern_path, 'r') as file:
            pattern = file.read()
            story, filename_from_story_gen = generate_news_with_mistral_chat(subject, pattern, estimated_chars = str)
            if not story or not isinstance(story, str) or story == "Error" or "Failed to generate story" in story: 
                error_msg = f"Story generation failed for subject '{subject}'."
                error_msg += f"Got story: {story[:100]}..." if story and isinstance(story, str) else "No story was generated"
                logger.error(error_msg)
                return None, None, None, None # Return None for all on story failure
        track_url_for_client = None
        try:
            _cleanup_old_audio_files(logger)
            
            if not filename_from_story_gen or not isinstance(filename_from_story_gen, str):
                filename_from_story_gen = f"story_{int(datetime.now().timestamp())}.mp3"
            elif not filename_from_story_gen.lower().endswith('.mp3'):
                filename_from_story_gen = f"{os.path.splitext(filename_from_story_gen)[0]}.mp3"
            
            speech_file_path_relative_to_static = openai_text_to_speech(story, filename_from_story_gen)
            if not speech_file_path_relative_to_static:
                logger.warning(f"TTS failed for story, but continuing without audio. Filename: {filename_from_story_gen}")
            elif not track_url_for_client:
                logger.warning(f"No music but speech will go on")
        except Exception as e:
            logger.warning(f"TTS encountered an error but continuing without audio: {str(e)}")
        
        # Get the ambient track URL
        track_url_for_client = _get_local_ambient_track_url(base_dir, logger)

        raw_story = story.strip() if story else ""
        cleaned_story = _clean_story_text(raw_story)
        return raw_story, cleaned_story, filename_from_story_gen, speech_file_path_relative_to_static, track_url_for_client
        
    except FileNotFoundError:
        logger.error(f"Pattern file not found: {pattern_path}")
        return None, None, None, None
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}", exc_info=True)
        return None, None, None, None

@app.route('/')
def index():
    return render_template('index_2.html')

@app.route('/generate_story', methods=['POST'])
def teller_ui():
    subject = _prepare_story_parameters(request.form)
    app_base_dir = os.path.dirname(__file__)
    
    # _generate_story_and_speech now handles track selection and returns its URL
    raw_story, story, display_filename, speech_file_static_path, track_url_for_client = \
        _generate_story_and_speech(subject, estimated_chars, PATTERN_FILE_PATH, app_base_dir, app.logger)

    audio_url_for_client = None
    if speech_file_static_path:
        audio_url_for_client = url_for('static', filename=speech_file_static_path)

    if not story:  # Only fail if story generation failed
        error_message = "Sorry, there was an error generating the story. Please try again."
        if not os.path.exists(PATTERN_FILE_PATH):
             error_message = "Sorry, the story pattern file is missing. Please contact support."
        
        app.logger.warning("Error response: Story generation failed.")

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
            return jsonify({"error": error_message}), 500
        else:
            return render_template("index.html", error=error_message), 500
            
    if not speech_file_static_path:
        app.logger.warning("TTS failed, but continuing with text-only story.")

    # Always provide audio_url and track_url to the client if available
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
        response_data = {
            'story': story,
            'tagged_story': raw_story,
            'display_filename': display_filename,
            'has_audio': bool(audio_url_for_client),
            'speechUrl': audio_url_for_client, # Will be None if not generated
            'trackUrl': track_url_for_client # Will be None if not found
            #related subjects could be added here later
        }
        if story:
            saved_fname = save_story_to_server(subject, raw_story, story)
            response_data['server_filename'] = saved_fname
        return jsonify(response_data)
    else:
        return render_template(
            'index.html',
            story=story,
            audio_url=audio_url_for_client,
            track_url=track_url_for_client,
            display_filename=display_filename,
            has_audio=bool(audio_url_for_client)
        )

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=False)
