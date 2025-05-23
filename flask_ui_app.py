import os
import random

from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, url_for

from src.teaicher.data.get_track_duration import get_track_duration, extract_service_name
from src.teaicher.services.get_story_length import get_user_story_length
from src.teaicher.services.generate_story import generate_story_strict, generate_story, generate_story_mistral
from src.teaicher.services.text_to_speech import openai_text_to_speech 
from src.teaicher.services.play_audio import play_audio_with_sync, play_audio

app = Flask(__name__)

load_dotenv()

# --- Configuration Flag for Playback Mode ---
ENABLE_VLC_PLAYBACK = True  # Set to False for browser-only playback, True for VLC server-side playback
DEFAULT_DURATION = 2
PATTERN_FILE_PATH = 'src/teaicher/config/patterns/insightful_brief.md'
LOCAL_AMBIENT_TRACKS = 'local_ambient_tracks'
YOUTUBE_AMBIENT_LANDSCAPES = 'youtube_ambient_landscapes'
YOUTUBE_AMBIENT_TRACKS = 'youtube_ambient_tracks'

def _get_local_ambient_track(base_dir, logger):
    ambient_dir = os.path.join(base_dir, 'static', 'audio', LOCAL_AMBIENT_TRACKS)
    try:
        ambient_tracks_files = [f for f in os.listdir(ambient_dir) if f.endswith('.mp3') or f.endswith('.wav')]
        if not ambient_tracks_files:
            logger.warning(f"No MP3 or WAV files found in {ambient_dir}. No ambient sound will be played.")
            return None
        track_filename = random.choice(ambient_tracks_files)
        return os.path.join(ambient_dir, track_filename)
    except FileNotFoundError:
        logger.error(f"Ambient songs directory not found: {ambient_dir}. No ambient sound will be played.")
        return None

def _read_youtube_urls(file_path, logger):
    """
    Read YouTube video URLs from a text file.
    
    Args:
        file_path: Path to the text file containing YouTube URLs
        logger: Logger instance for error logging
        
    Returns:
        list: List of valid YouTube URLs (stripped of whitespace and comments)
    """
    try:
        with open(file_path, 'r') as f:
            # Read non-empty, non-comment lines and strip whitespace
            return [line.strip() for line in f 
                    if line.strip() and not line.strip().startswith('#')]
    except Exception as e:
        logger.error(f"Error reading YouTube URLs from {file_path}: {str(e)}")
        return []

def _get_ambient_landscapes_from_youtube(base_dir, logger):
    """
    Get a random landscape track URL.
    
    Args:
        base_dir: Base directory of the application
        logger: Logger instance
        
    Returns:
        str: A random YouTube URL from the landscape tracks or None if no tracks found
    """
    youtube_dir = os.path.join(base_dir, 'static', 'audio', YOUTUBE_AMBIENT_LANDSCAPES)
    os.makedirs(youtube_dir, exist_ok=True)  # Create directory if it doesn't exist
    
    try:
        # Look for .txt files in the directory
        url_files = [f for f in os.listdir(youtube_dir) if f.endswith('.txt')]
        if not url_files:
            logger.warning(f"No URL files found in {youtube_dir}")
            return None
            
        # Choose a random URL file and read URLs
        url_file = random.choice(url_files)
        url_file_path = os.path.join(youtube_dir, url_file)
        urls = _read_youtube_urls(url_file_path, logger)
            
        if not urls:
            logger.warning(f"No valid URLs found in {url_file}")
            return None
            
        return random.choice(urls)  # Return a random URL from the file
        
    except FileNotFoundError:
        logger.error(f"Ambient landscapes directory not found: {youtube_dir}")
        return None
    
def _get_ambient_track_from_youtube(base_dir, logger):
    """
    Get a random track URL from YouTube ambient tracks.
    
    Args:
        base_dir: Base directory of the application
        logger: Logger instance
        
    Returns:
        str: A random YouTube URL from the tracks or None if no tracks found
    """
    youtube_dir = os.path.join(base_dir, 'static', 'audio', YOUTUBE_AMBIENT_TRACKS)
    os.makedirs(youtube_dir, exist_ok=True)  # Create directory if it doesn't exist
    
    try:
        # Look for .txt files in the directory
        url_files = [f for f in os.listdir(youtube_dir) if f.endswith('.txt')]
        if not url_files:
            logger.warning(f"No URL files found in {youtube_dir}")
            return None
            
        # Choose a random URL file and read URLs
        url_file = random.choice(url_files)
        url_file_path = os.path.join(youtube_dir, url_file)
        urls = _read_youtube_urls(url_file_path, logger)
            
        if not urls:
            logger.warning(f"No valid URLs found in {url_file}")
            return None
            
        return random.choice(urls)  # Return a random URL from the file
        
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
    estimated_chars = get_user_story_length(duration)
    return subject, duration, estimated_chars

def _generate_story_and_speech(subject, estimated_chars, pattern_path, logger):
    try:
        with open(pattern_path, 'r') as file:
            pattern = file.read().replace("{subject}", str(subject)).replace("{estimated_chars}", str(estimated_chars))
        story, filename_from_story_gen = generate_story_mistral(subject, pattern, estimated_chars)
        if story == "Error" or "Failed to generate story" in story: 
             logger.error(f"Story generation failed for subject '{subject}'. AI output: {story}")
             return None, None, None 
        speech_file_path_relative_to_static = openai_text_to_speech(story, filename_from_story_gen)
        
        if not speech_file_path_relative_to_static:
            logger.error(f"TTS failed for story based on filename: {filename_from_story_gen}")
            return None, None, None
            
        return story, filename_from_story_gen, speech_file_path_relative_to_static
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
    track_path = _get_local_ambient_track(app_base_dir, app.logger)
    # track_path = _get_ambient_track_from_youtube(app_base_dir, app.logger)
    # track_path = _get_ambient_landscapes_from_youtube(app_base_dir, app.logger)

    story, display_filename, speech_file_static_path = _generate_story_and_speech(subject, estimated_chars, PATTERN_FILE_PATH, app.logger)

    audio_url_for_client = None
    if speech_file_static_path:
        audio_url_for_client = url_for('static', filename=speech_file_static_path)

    speech_file_system_path = None
    if speech_file_static_path:
        speech_file_system_path = os.path.join(app.static_folder, speech_file_static_path)

    if not story or not speech_file_static_path: # Check speech_file_static_path for early exit
        error_message = "Sorry, there was an error generating the story or audio. Please try again."
        if not os.path.exists(PATTERN_FILE_PATH):
             error_message = "Sorry, the story pattern file is missing. Please contact support."
        
        # No audio_url_for_client check here as it depends on speech_file_static_path
        app.logger.warning("Error response: Story or speech_file_static_path missing.")

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
            return jsonify({"error": error_message}), 500
        else:
            return render_template("index.html", error=error_message), 500

    # Conditional VLC Playback
    if ENABLE_VLC_PLAYBACK:
        if speech_file_system_path: # Ensure we have a valid system path for speech
            if track_path: # If an ambient track is also available
                app.logger.info(f"VLC Enabled: Playing story with ambient track: {speech_file_system_path}, Track: {track_path}")
                play_audio_with_sync(speech_file_system_path, track_path)
            else: # Play speech only
                app.logger.info(f"VLC Enabled: Playing story (no ambient track): {speech_file_system_path}")
                play_audio(speech_file_system_path)
        else:
            app.logger.warning("VLC Enabled but playback skipped: speech_file_system_path is not available.")
    else:
        app.logger.info("VLC Playback Disabled by configuration.")

    # Always provide the audio_link to the client if available
    # The client-side JavaScript will decide how to use it (e.g., based on its own logic or future enhancements)
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
        return jsonify({"story": story, "title": display_filename, "audio_link": audio_url_for_client})
    else:
        return render_template("index.html", story=story, title=display_filename, audio_link=audio_url_for_client)

if __name__ == "__main__":
    app.run(debug=True)
