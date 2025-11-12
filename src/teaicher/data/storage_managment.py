import os, json
import re
import glob
import shutil

from flask import current_app
from datetime import datetime

def _cleanup_old_audio_files(logger, max_files=5):
    """
    Keep only the most recent audio files in the generated_stories directory.
    """
    try:
        generated_stories_dir = os.path.join(app.static_folder, 'audio', 'generated_stories')
        archive_dir = os.path.join(app.static_folder, 'audio', 'archived_stories')
        
        if not os.path.exists(archive_dir):
            os.makedirs(archive_dir)
            
        audio_files = []
        for file_path in glob.glob(os.path.join(generated_stories_dir, '*.mp3')):
            mtime = os.path.getmtime(file_path)
            audio_files.append((mtime, file_path))
        
        audio_files.sort()
        
        while len(audio_files) >= max_files:
            _, oldest_file_path = audio_files.pop(0)
            file_name = os.path.basename(oldest_file_path)
            destination_path = os.path.join(archive_dir, file_name)
            try:
                shutil.move(oldest_file_path, destination_path)
                logger.info(f"moved old audio file: {oldest_file_path}")
            except Exception as e:
                logger.error(f"Error moving old audio file {oldest_file_path}: {e}")
    except Exception as e:
        logger.error(f"Error in _cleanup_old_audio_files: {e}")

BASE = os.path.join(os.path.dirname(__file__), '..', '..', 'server_data', 'stories')
os.makedirs(BASE, exist_ok=True)

def save_story_to_server(subject: str, raw: str, clean: str) -> str:
    """
    Writes a JSON file with subject, raw text, clean text, timestamp.
    Returns the filename for reference.
    """
    base = os.path.join(current_app.instance_path, 'stories')
    os.makedirs(base, exist_ok=True)
    
    timestamp = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    safe = re.sub(r'[^\w-]', '_', subject.lower())[:50] or "story"
    fname = f"{timestamp}_{safe}.json"
    path  = os.path.join(BASE, fname)

    payload = {
        'subject': subject,
        'raw':     raw,
        'clean':   clean,
        'timestamp': timestamp
    }
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    return fname
