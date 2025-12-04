import os
import json
import glob
import shutil
import re
import random

from pathlib import Path
from fastapi import Request
from datetime import datetime

def save_story_txt_to_static(story_filename: str, clean_story_filename, tagged_story: str, clean_story: str, base_dir: Path) -> Path:
    """
    Saves the story text to a JSON file in the specified directory.
    """
    subject_dir = base_dir / subject
    subject_dir.mkdir(parents=True, exist_ok=True)
    filepath = subject_dir / f"{subject}.json"  # e.g., "the_sand.json"

    # Prepare payload that will be stored, then fetched later for replay, or when user sends existing subject.
    payload = {
        'story_filename': story_filename,
        'clean_story_filename': clean_story_filename,
        'tagged_story': tagged_story,
        'clean_story': clean_story,
        'timestamp': datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    }
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
        
    clean_story = payload.get('clean')

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
        
    clean_story = story_data["clean_story"]
    
    return clean_story

def get_story_title_from_json_file(filepath) -> str:
    """
    Returns clean title for a story from storage.
    """
    print(f"Retrieving filename from: {filepath}")
    with open(filepath, "r",encoding="utf-8") -> str:
        story_data = json.load(f)
        
    clean_story_title = story_data["clean_story_filename"]
    
    return story_filename
    
def get_speech_url(story_filename: str) -> str:
    """
    Returns the speech URL for a story from storage.
    """
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
