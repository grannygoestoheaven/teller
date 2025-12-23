import os
import re
import shutil
import json
from datetime import datetime

from pathlib import Path

def migrate_stories():
    text_dir = "static/text/jsonStories"
    audio_dir = "static/audio/generated_stories_audio"
    new_dir = "static/stories"

    for filename in os.listdir(text_dir):
        subject = re.sub(r'^\d+T\d+Z_|\.json$', '', filename)  # Extract subject
        os.makedirs(f"{new_dir}/{subject}", exist_ok=True)
        shutil.move(f"{text_dir}/{filename}", f"{new_dir}/{subject}/story.json")

        # Find matching audio (case-insensitive)
        for audio_file in os.listdir(audio_dir):
            if subject.lower() in audio_file.lower():
                shutil.move(f"{audio_dir}/{audio_file}", f"{new_dir}/{subject}/audio.mp3")
                break

migrate_stories()

def filter_stories():
    stories_dir = "static/stories"
    txt_alone_dir = "static/txt_alone"
    os.makedirs(txt_alone_dir, exist_ok=True)

    for subject in os.listdir(stories_dir):
        story_path = f"{stories_dir}/{subject}/story.json"
        audio_path = f"{stories_dir}/{subject}/audio.mp3"

        if not os.path.exists(audio_path):
            os.makedirs(txt_alone_dir, exist_ok=True)
            shutil.move(story_path, f"{txt_alone_dir}/{subject}.json")
            os.rmdir(f"{stories_dir}/{subject}")  # Remove empty folder

filter_stories()

def rename_files_in_stories_dir():
    stories_dir = Path("static/stories")

    for subject_dir in stories_dir.iterdir():
        if subject_dir.is_dir():
            subject = subject_dir.name
            # Rename story.json -> {subject}.json
            json_file = subject_dir / "story.json"
            if json_file.exists():
                json_file.rename(subject_dir / f"{subject}.json")

            # Rename audio.mp3 -> {subject}.mp3
            audio_file = subject_dir / "audio.mp3"
            if audio_file.exists():
                audio_file.rename(subject_dir / f"{subject}.mp3")

rename_files_in_stories_dir()
