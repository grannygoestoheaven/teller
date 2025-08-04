import os
import re
import random
import glob
from datetime import datetime

from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, url_for

from src.teaicher.services.generate_story import generate_story
from src.teaicher.services.text_to_speech import openai_text_to_speech

app = Flask(__name__)

load_dotenv()

# --- Configuration Constants ---
DEFAULT_DURATION = 1
PATTERN_FILE_PATH = 'src/teaicher/config/patterns/insightful_brief.md'
LOCAL_AMBIENT_TRACKS_DIR = 'local_ambient_tracks'
YOUTUBE_AMBIENT_LANDSCAPES_DIR = 'youtube_ambient_landscapes' # Not used in current logic, kept for reference
YOUTUBE_AMBIENT_TRACKS_DIR = 'youtube_ambient_tracks'         # Not used in current logic, kept for reference

# Class to manage ambient track playback state
class AmbientTrackManager:
    _instance = None
    _tracks = []
    _played_tracks = []
    _initialized = False
    
    @classmethod
    def initialize(cls, base_dir):
        if not cls._initialized:
            ambient_dir = os.path.join(base_dir, 'static', 'audio', LOCAL_AMBIENT_TRACKS_DIR)
            try:
                cls._tracks = [f for f in os.listdir(ambient_dir) 
                            if f.endswith(('.mp3', '.wav', '.flac'))]
                random.shuffle(cls._tracks)  # Initial shuffle for more randomness
                cls._initialized = True
            except FileNotFoundError:
                app.logger.warning(f"Ambient tracks directory not found: {ambient_dir}")
                cls._tracks = [] # Ensure it's empty if dir not found
                cls._initialized = True # Mark as initialized to prevent repeated warnings
    
    @classmethod
    def get_next_track(cls, base_dir, logger):
        if not cls._initialized:
            cls.initialize(base_dir)
            
        ambient_dir = os.path.join(base_dir, 'static', 'audio', LOCAL_AMBIENT_TRACKS_DIR)
        
        if not cls._tracks and not cls._played_tracks:
            logger.warning(f"No MP3 or WAV files found in {ambient_dir}. No ambient sound will be played.")
            return None
            
        # If we've played all tracks, refresh the list
        if not cls._tracks:
            cls._tracks = cls._played_tracks
            cls._played_tracks = []
            random.shuffle(cls._tracks)  # Reshuffle before starting over
            
        # Get next track and move it to played
        track_filename = cls._tracks.pop(0)
        # We store the relative path for the client
        relative_track_path = os.path.join('audio', LOCAL_AMBIENT_TRACKS_DIR, track_filename)
        cls._played_tracks.append(track_filename) # Store original filename for internal management
        
        return relative_track_path

def _get_local_ambient_track_url(base_dir, logger):
    """
    Retrieves the URL for the next local ambient track.
    This URL is relative to the static folder, suitable for url_for.
    """
    try:
        track_relative_static_path = AmbientTrackManager.get_next_track(base_dir, logger)
        if track_relative_static_path:
            return url_for('static', filename=track_relative_static_path)
        return None
    except Exception as e:
        logger.error(f"Error getting ambient track URL: {str(e)}")
        return None

# The following YouTube functions are currently unused and can be kept for future expansion or removed.
def _read_youtube_urls(file_path, logger):
    try:
        with open(file_path, 'r') as f:
            return [line.strip() for line in f 
                    if line.strip() and not line.strip().startswith('#')]
    except Exception as e:
        logger.error(f"Error reading YouTube URLs from {file_path}: {str(e)}")
        return []

def _get_ambient_landscapes_from_youtube(base_dir, logger):
    youtube_dir = os.path.join(base_dir, 'static', 'audio', YOUTUBE_AMBIENT_LANDSCAPES_DIR)
    os.makedirs(youtube_dir, exist_ok=True)
    try:
        url_files = [f for f in os.listdir(youtube_dir) if f.endswith('.txt')]
        if not url_files:
            logger.warning(f"No URL files found in {youtube_dir}")
            return None
        url_file = random.choice(url_files)
        url_file_path = os.path.join(youtube_dir, url_file)
        urls = _read_youtube_urls(url_file_path, logger)
        if not urls:
            logger.warning(f"No valid URLs found in {url_file}")
            return None
        return random.choice(urls)
    except FileNotFoundError:
        logger.error(f"Ambient landscapes directory not found: {youtube_dir}")
        return None
    
def _get_ambient_track_from_youtube(base_dir, logger):
    youtube_dir = os.path.join(base_dir, 'static', 'audio', YOUTUBE_AMBIENT_TRACKS_DIR)
    os.makedirs(youtube_dir, exist_ok=True)
    try:
        url_files = [f for f in os.listdir(youtube_dir) if f.endswith('.txt')]
        if not url_files:
            logger.warning(f"No URL files found in {youtube_dir}")
            return None
        url_file = random.choice(url_files)
        url_file_path = os.path.join(youtube_dir, url_file)
        urls = _read_youtube_urls(url_file_path, logger)
        if not urls:
            logger.warning(f"No valid URLs found in {url_file}")
            return None
        return random.choice(urls)
    except FileNotFoundError:
        logger.error(f"Ambient tracks directory not found: {youtube_dir}")
        return None

# helper functions for parameters, track selection, and story generation
def _prepare_story_parameters(request_form):
    subject = request_form.get('subject')
    duration_str = request_form.get('duration', str(DEFAULT_DURATION))
    try:
        duration = int(duration_str)
        if duration < 1:
            duration = 1
    except ValueError:
        duration = DEFAULT_DURATION
    estimated_chars = 1000 # Hardcoded as per original, can be dynamic later
    return subject, duration, estimated_chars

def _clean_story_text(story: str) -> str:
    """
    Clean the story text by removing <[silence]> tags and ensuring proper punctuation. The goal is to have
    a well-formed story with sentences ending in periods, and to remove unnecessary whitespace.
    """
    if not story:
        return story
    cleaned = re.sub(r'<\[silence]>(\s*)', lambda m: ' ' if m.group(1) else '', story)
    cleaned = re.sub(r'([a-z])(\s*\n|$)', r'\1.\2', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\.\.+', '.', cleaned)
    cleaned = re.sub(r'\.([^ \n])', r'. \1', cleaned)
    return cleaned.strip()

def _cleanup_old_audio_files(logger, max_files=5):
    """
    Keep only the most recent audio files in the generated_stories directory.
    """
    try:
        generated_stories_dir = os.path.join(app.static_folder, 'audio', 'generated_stories')
        audio_files = []
        for file_path in glob.glob(os.path.join(generated_stories_dir, '*.mp3')):
            mtime = os.path.getmtime(file_path)
            audio_files.append((mtime, file_path))
        
        audio_files.sort()
        
        while len(audio_files) >= max_files:
            _, oldest_file = audio_files.pop(0)
            try:
                os.remove(oldest_file)
                logger.info(f"Removed old audio file: {oldest_file}")
            except Exception as e:
                logger.error(f"Error removing old audio file {oldest_file}: {e}")
    except Exception as e:
        logger.error(f"Error in _cleanup_old_audio_files: {e}")

def _generate_story_and_speech(subject, estimated_chars, pattern_path, base_dir, logger):
    """
    Generates a story and speech, returning paths for both.
    Also selects an ambient track URL.
    """
    story = None
    filename_from_story_gen = None
    speech_file_path_relative_to_static = None
    track_url_for_client = None

    try:
        with open(pattern_path, 'r') as file:
            # pattern = file.read().replace("{subject}", str(subject)).replace("{estimated_chars}", str(estimated_chars))
            pattern = file.read()
            story, filename_from_story_gen = generate_story(subject, pattern, estimated_chars)
            if not story or not isinstance(story, str) or story == "Error" or "Failed to generate story" in story: 
                error_msg = f"Story generation failed for subject '{subject}'."
                error_msg += f"Got story: {story[:100]}..." if story and isinstance(story, str) else "No story was generated"
                logger.error(error_msg)
                return None, None, None, None # Return None for all on story failure
        
        try:
            _cleanup_old_audio_files(logger)
            
            if not filename_from_story_gen or not isinstance(filename_from_story_gen, str):
                filename_from_story_gen = f"story_{int(datetime.now().timestamp())}.mp3"
            elif not filename_from_story_gen.lower().endswith('.mp3'):
                filename_from_story_gen = f"{os.path.splitext(filename_from_story_gen)[0]}.mp3"
            
            speech_file_path_relative_to_static = openai_text_to_speech(story, filename_from_story_gen)
            if not speech_file_path_relative_to_static:
                logger.warning(f"TTS failed for story, but continuing without audio. Filename: {filename_from_story_gen}")
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
    return render_template('index.html')

@app.route('/generate_story', methods=['POST'])
def teller_ui():
    subject, duration, estimated_chars = _prepare_story_parameters(request.form)
    app_base_dir = os.path.dirname(__file__)
    
    # _generate_story_and_speech now handles track selection and returns its URL
    story, display_filename, speech_file_static_path, track_url_for_client = \
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
            'display_filename': display_filename,
            'has_audio': bool(audio_url_for_client),
            'audio_url': audio_url_for_client, # Will be None if not generated
            'track_url': track_url_for_client # Will be None if not found
        }
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
