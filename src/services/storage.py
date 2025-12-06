import os
import json
import glob
import shutil
import re
import random

from pathlib import Path
from fastapi import Request
from datetime import datetime

from src.config.settings import STATIC_DIR, GENERATED_STORIES_DIR, LOCAL_TRACKS_DIR

# ==== STORING FUNCTIONS =====

def save_story_txt_to_json_file(story_filename: str, story_title: str, tagged_story_for_tts: str, clean_story: str, save_dir: Path) -> Path:
    """
    Saves the story text to a JSON file in the specified directory.
    """
    subject_dir = save_dir / story_filename
    subject_dir.mkdir(parents=True, exist_ok=True)
    filepath = subject_dir / f"{story_filename}.json"  # e.g., "the_sand.json"
    timestamp = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')

    # Prepare payload that will be stored, then fetched later for replay, or when user sends existing subject.
    payload = {
        "story_filename": story_filename,
        "story_title": story_title,
        "tagged_story_for_tts": tagged_story_for_tts,
        "clean_story": clean_story,
        "timestamp": timestamp
    }
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
        
    clean_story = payload["clean_story"]

def save_mp3_speech_file(speech_filename: str, speech_audio: bytes, save_dir: Path) -> str:
    """
    Saves the speech mp3 audio content to a file in the specified directory.
    """
    save_dir.mkdir(parents=True, exist_ok=True)
    filepath = save_dir / speech_filename
    
    with open(filepath, "wb") as f:
        f.write(speech_audio)
        
    audio_fullpath = filepath.resolve()
        
    return str(audio_fullpath)

# ==== FETCHING FUNCTIONS =====

def get_clean_story_from_json_file(story_filename) -> str:
    """
    Extracts the cleaned story from the saved JSON file.
    """
    json_path = STATIC_DIR / "stories" / story_filename / f"{story_filename}.json"
    print(f"Retrieving clean story from: {json_path}")
    
    with open(json_path, "r", encoding="utf-8") as f:
        story_data = json.load(f)
        clean_story = story_data["clean_story"]
    
    return clean_story

def get_story_title_from_json_file(story_filename) -> str:
    """
    Returns clean title for a story from storage.
    """
    story_filename_path = STATIC_DIR / "stories" / story_filename / f"{story_filename}.json"
    print(f"Retrieving filename from: {story_filename_path}")
    print(story_filename_path.exists())
    
    with open(story_filename_path, "r",encoding="utf-8") as f:
        story_data = json.load(f)
        print(f"Loaded story data: {story_data}")
        story_title = story_data["story_title"]
        print(f"Extracted story title: {story_title}")
    
    return story_title
    
def get_speech_url(story_filename: str) -> str:
    """
    Returns the speech URL for a story from storage.
    """
    speech_url = f"/static/stories/{story_filename}/{story_filename}.mp3"
    
    return speech_url

# ======= BACKGROUND TRACKS  =======

def get_random_track_url(tracks_dir) -> str | None:
    """
    Returns the relative path of the next ambient track (e.g., "audio/ambient/track.mp3").
    Returns None if no tracks are available.
    """
    try:
        return AmbientTrackManager.get_next_track(tracks_dir)
    except Exception as e:
        print(f"Error getting ambient track: {e}")  # Replace with your logger
        return None

# def get_clean_track_title(tracks_dir):

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
    def get_next_track(cls, tracks_dir) -> str | None:
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

