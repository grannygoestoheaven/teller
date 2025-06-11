import os
import re
import random
import glob
from datetime import datetime

from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, url_for

# from src.teaicher.data.get_track_duration import get_track_duration, extract_service_name
# from src.teaicher.services.get_story_length import get_user_story_length
from src.teaicher.services.generate_story import generate_story
from src.teaicher.services.text_to_speech import openai_text_to_speech 
from src.teaicher.services.play_audio import play_audio_with_sync, play_audio

# Get the absolute path to the directory containing this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, 
            static_folder=os.path.join(BASE_DIR, 'static'),
            static_url_path='/static')

# Ensure static files are served with the correct MIME type
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Disable caching for development
app.config['TEMPLATES_AUTO_RELOAD'] = True

# Ensure the static folder exists
os.makedirs(os.path.join(BASE_DIR, 'static'), exist_ok=True)

# Add a route to serve static files with proper caching
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename, cache_timeout=0)

load_dotenv()

# --- Configuration Flag for Playback Mode ---
ENABLE_VLC_PLAYBACK = True  # Set to False for browser-only playback, True for VLC server-side playback
DEFAULT_DURATION = 1
PATTERN_FILE_PATH = 'src/teaicher/config/patterns/insightful_brief.md'
LOCAL_AMBIENT_TRACKS = 'local_ambient_tracks'
YOUTUBE_AMBIENT_LANDSCAPES = 'youtube_ambient_landscapes'
YOUTUBE_AMBIENT_TRACKS = 'youtube_ambient_tracks'

# Class to manage ambient track playback state
class AmbientTrackManager:
    _instance = None
    _tracks = []
    _played_tracks = []
    _initialized = False
    
    @classmethod
    def initialize(cls, base_dir):
        if not cls._initialized:
            ambient_dir = os.path.join(base_dir, 'static', 'audio', LOCAL_AMBIENT_TRACKS)
            try:
                cls._tracks = [f for f in os.listdir(ambient_dir) 
                            if f.endswith(('.mp3', '.wav', '.flac'))]
                random.shuffle(cls._tracks)  # Initial shuffle for more randomness
                cls._initialized = True
            except FileNotFoundError:
                pass
    
    @classmethod
    def get_next_track(cls, base_dir, logger):
        if not cls._initialized:
            cls.initialize(base_dir)
            
        ambient_dir = os.path.join(base_dir, 'static', 'audio', LOCAL_AMBIENT_TRACKS)
        
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
        cls._played_tracks.append(track_filename)
        
        return os.path.join(ambient_dir, track_filename)

def _get_local_ambient_track(base_dir, logger):
    try:
        track_path = AmbientTrackManager.get_next_track(base_dir, logger)
        if track_path and not os.path.exists(track_path):
            logger.error(f"Track file not found: {track_path}")
            return None
        return track_path
    except Exception as e:
        logger.error(f"Error getting ambient track: {str(e)}")
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
    # estimated_chars = get_user_story_length(duration)
    estimated_chars = 1000
    return subject, duration, estimated_chars

def _clean_story_text(story: str) -> str:
    """
    Clean the story text by removing <[silence]> tags and ensuring proper punctuation.
    
    Args:
        story: The story text potentially containing <[silence]> tags
        
    Returns:
        str: The cleaned story text with proper punctuation
    """
    if not story:
        return story
        
    # First, remove all <[silence]> tags
    cleaned = re.sub(r'<\[silence]>(\s*)', lambda m: ' ' if m.group(1) else '', story)
    
    # Ensure proper punctuation at the end of sentences
    # This adds a period if the line ends with a letter (case-insensitive) and is not followed by punctuation
    cleaned = re.sub(r'([a-z])(\s*\n|$)', r'\1.\2', cleaned, flags=re.IGNORECASE)
    
    # Fix double periods that might have been created
    cleaned = re.sub(r'\.\.+', '.', cleaned)
    
    # Ensure there's a space after periods if not already present
    cleaned = re.sub(r'\.([^ \n])', r'. \1', cleaned)
    
    return cleaned.strip()


def _cleanup_old_audio_files(logger, max_files=5):
    """
    Keep only the most recent audio files in the generated_stories directory.
    
    Args:
        logger: Logger instance for logging messages
        max_files: Maximum number of audio files to keep (default: 5)
    """
    try:
        # Get the absolute path to the generated_stories directory
        generated_stories_dir = os.path.join('static', 'audio', 'generated_stories')
        
        # Get all mp3 files in the directory with their modification times
        audio_files = []
        for file_path in glob.glob(os.path.join(generated_stories_dir, '*.mp3')):
            mtime = os.path.getmtime(file_path)
            audio_files.append((mtime, file_path))
        
        # Sort by modification time (oldest first)
        audio_files.sort()
        
        # Delete oldest files if we have more than max_files
        while len(audio_files) >= max_files:
            _, oldest_file = audio_files.pop(0)
            try:
                os.remove(oldest_file)
                logger.info(f"Removed old audio file: {oldest_file}")
            except Exception as e:
                logger.error(f"Error removing old audio file {oldest_file}: {e}")
                
    except Exception as e:
        logger.error(f"Error in _cleanup_old_audio_files: {e}")


def _generate_story_and_speech(subject, estimated_chars, pattern_path, logger):
    try:
        with open(pattern_path, 'r') as file:
            pattern = file.read().replace("{subject}", str(subject)).replace("{estimated_chars}", str(estimated_chars))
        
        # Generate the story first
        story, filename_from_story_gen = generate_story(subject, pattern, estimated_chars)
        
        # Check if story generation failed or returned None/empty
        if not story or not isinstance(story, str) or story == "Error" or "Failed to generate story" in story: 
            error_msg = f"Story generation failed for subject '{subject}'. "
            error_msg += f"Got story: {story[:100]}..." if story and isinstance(story, str) else "No story was generated"
            logger.error(error_msg)
            return None, None, None 
        
        # Try to generate speech, but don't fail if it doesn't work
        speech_file_path_relative_to_static = None
        try:
            # Clean up old audio files before generating a new one
            _cleanup_old_audio_files(logger)
            
            # Ensure filename is valid
            if not filename_from_story_gen or not isinstance(filename_from_story_gen, str):
                filename_from_story_gen = f"story_{int(datetime.now().timestamp())}.mp3"
            elif not filename_from_story_gen.lower().endswith('.mp3'):
                filename_from_story_gen = f"{os.path.splitext(filename_from_story_gen)[0]}.mp3"
            
            # Generate speech with the original story (including silence tags)
            speech_file_path_relative_to_static = openai_text_to_speech(story, filename_from_story_gen)
            if not speech_file_path_relative_to_static:
                logger.warning(f"TTS failed for story, but continuing without audio. Filename: {filename_from_story_gen}")
        except Exception as e:
            logger.warning(f"TTS encountered an error but continuing without audio: {str(e)}")
        
        # Clean the story text before returning it (remove <[silence]> tags)
        cleaned_story = _clean_story_text(story)
        return cleaned_story, filename_from_story_gen, speech_file_path_relative_to_static
        
    except FileNotFoundError:
        logger.error(f"Pattern file not found: {pattern_path}")
        return None, None, None
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}", exc_info=True)  # Include stack trace
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

    if not story:  # Only fail if story generation failed
        error_message = "Sorry, there was an error generating the story. Please try again."
        if not os.path.exists(PATTERN_FILE_PATH):
             error_message = "Sorry, the story pattern file is missing. Please contact support."
        
        app.logger.warning("Error response: Story generation failed.")

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
            return jsonify({"error": error_message}), 500
        else:
            return render_template("index.html", error=error_message), 500
            
    # If we get here, we have a story, but TTS might have failed
    if not speech_file_static_path:
        app.logger.warning("TTS failed, but continuing with text-only story.")
        # Continue processing with story but no audio

    # Conditional VLC Playback
    if ENABLE_VLC_PLAYBACK and speech_file_system_path:  # Only try to play if we have audio
        try:
            if track_path:  # If an ambient track is available
                app.logger.info(f"VLC Enabled: Playing story with ambient track: {speech_file_system_path}, Track: {track_path}")
                play_audio_with_sync(speech_file_system_path, track_path)
            else:  # Play speech only
                app.logger.info(f"VLC Enabled: Playing story (no ambient track): {speech_file_system_path}")
                play_audio(speech_file_system_path)
        except Exception as e:
            app.logger.error(f"Error during VLC playback: {e}")
            # Continue with the response even if playback fails
    else:
        app.logger.info("VLC Playback Disabled by configuration.")

    # Always provide the audio_link to the client if available
    # The client-side JavaScript will decide how to use it (e.g., based on its own logic or future enhancements)
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
        response_data = {
            'story': story,
            'display_filename': display_filename,
            'has_audio': bool(audio_url_for_client)
        }
        if audio_url_for_client:
            response_data['audio_url'] = audio_url_for_client
        # ONLY add track_path if it's not None
        if track_path:
            response_data['track_path'] = track_path
        return jsonify(response_data)
    else:
        # This part is for direct page loads, not AJAX
        return render_template(
            'index.html',
            story=story,
            audio_url=audio_url_for_client,
            track_path=track_path, # This is fine for direct render, as Jinja handles None
            display_filename=display_filename,
            has_audio=bool(audio_url_for_client)
        )

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=7860, debug=False)
