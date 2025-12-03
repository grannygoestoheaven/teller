import os
import json
import glob
import shutil
import re
import random

from pathlib import Path
from fastapi import Request
from datetime import datetime


def save_story_txt_to_static(tagged: str, clean: str, subject: str, base_dir: Path) -> Path:
    """
    Saves the story text to a JSON file in the specified directory.
    """
    subject_dir = base_dir / subject
    subject_dir.mkdir(parents=True, exist_ok=True)
    filepath = subject_dir / f"{subject}.json"  # e.g., "the_sand.json"

    payload = {
        'tagged': tagged,
        'clean': clean,
        'timestamp': datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    }
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
        
    clean_story = payload.get('clean')

    print(f"Saved story JSON to: {filepath.resolve()}")
    
    return clean_story

def save_speech_file_to_static(filename: str, content: bytes, save_dir: Path) -> str:
    """
    Saves the speech mp3 audio content to a file in the specified directory.
    """
    save_dir.mkdir(parents=True, exist_ok=True)
    
    filepath = save_dir / filename
    with open(filepath, "wb") as f:
        f.write(content)
        
    audio_fullpath = filepath.resolve()
        
    return str(audio_fullpath)

def get_clean_story_from_json_file(filepath) -> str:
    """
    Extracts the cleaned story from the saved JSON file.
    """
    print(f"Retrieving clean story from: {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        story_data = json.load(f)
        
    clean_story = story_data["clean"]
    
    return clean_story

def get_story_filenames(subject: str) -> dict:
    """Returns filenames for a story from storage."""
    story_filename = f"static/stories/{subject}/{subject}.json"
    speech_filename = f"static/speech/{subject}/{subject}.mp3"
    
def get_speech_url(story_filename: str) -> str:
    """Returns the speech URL for a story from storage."""
    speech_url = f"/static/speech/{story_filename}/{story_filename}.mp3"
    
    return speech_url

# Handling random track selecton 
class AmbientTrackManager:
    _instance = None
    _tracks = []
    _played_tracks = []
    _initialized = False

    @classmethod
    def initialize(cls, tracks_dir: str) -> None:
        if cls._initialized:
            return
        try:
            cls._tracks = [
                f.name for f in tracks_dir.iterdir()
                if f.suffix.lower() in (".mp3", ".wav", ".flac")
            ]
            random.shuffle(cls._tracks)
        except FileNotFoundError:
            cls._tracks = []
        cls._initialized = True

    @classmethod
    def get_next_track(cls, tracks_dir) -> str | None:  # Remove base_dir argument
        if not cls._initialized:
            cls.initialize(tracks_dir)
        if not cls._tracks and not cls._played_tracks:
            return None
        if not cls._tracks:
            cls._tracks, cls._played_tracks = cls._played_tracks, []
            random.shuffle(cls._tracks)

        track_filename = cls._tracks.pop(0)
        cls._played_tracks.append(track_filename)
        
        return str(tracks_dir / track_filename)  # Use LOCAL_TRACKS_DIR directly

def get_random_track_path(tracks_dir) -> str | None:
    """
    Returns the relative path of the next ambient track (e.g., "audio/ambient/track.mp3").
    Returns None if no tracks are available.
    """
    try:
        return AmbientTrackManager.get_next_track(tracks_dir)
    except Exception as e:
        print(f"Error getting ambient track: {e}")  # Replace with your logger
        return None


# def _cleanup_old_audio_files(logger, max_files=5):
#     """
#     Keep only the most recent audio files in the generated_stories directory.
#     """
#     try:
#         generated_stories_dir = os.path.join(app.static_folder, 'audio', 'generated_stories')
#         archive_dir = os.path.join(app.static_folder, 'audio', 'archived_stories')
        
#         if not os.path.exists(archive_dir):
#             os.makedirs(archive_dir)
            
#         audio_files = []
#         for file_path in glob.glob(os.path.join(generated_stories_dir, '*.mp3')):
#             mtime = os.path.getmtime(file_path)
#             audio_files.append((mtime, file_path))
        
#         audio_files.sort()
#         # ///// to translate in js
#             try:
#                 _cleanup_old_audio_files(logger)
            
#             if not filename_from_story_gen or not isinstance(filename_from_story_gen, str):
#                 filename_from_story_gen = f"story_{int(datetime.now().timestamp())}.mp3"
#             elif not filename_from_story_gen.lower().endswith('.mp3'):
#                 filename_from_story_gen = f"{os.path.splitext(filename_from_story_gen)[0]}.mp3"
            
#             if not speech_file_path_relative_to_static:
#                 logger.warning(f"TTS failed for story, but continuing without audio. Filename: {filename_from_story_gen}")
#             elif not track_url_for_client:
#                 logger.warning(f"No music but speech will go on")
#         except Exception as e:
#             logger.warning(f"TTS encountered an error but continuing without audio: {str(e)}")
        
#         # /////
        
#         while len(audio_files) >= max_files:
#             _, oldest_file_path = audio_files.pop(0)
#             file_name = os.path.basename(oldest_file_path)
#             destination_path = os.path.join(archive_dir, file_name)
#             try:
#                 shutil.move(oldest_file_path, destination_path)
#                 logger.info(f"moved old audio file: {oldest_file_path}")
#             except Exception as e:
#                 logger.error(f"Error moving old audio file {oldest_file_path}: {e}")
#     except Exception as e:
#         logger.error(f"Error in _cleanup_old_audio_files: {e}")

# BASE = os.path.join(os.path.dirname(__file__), '..', '..', 'server_data', 'stories')
# os.makedirs(BASE, exist_ok=True)