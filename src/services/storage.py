import os
import json
import re

from pathlib import Path
from fastapi import Request
from datetime import datetime

def _save_story_txt_to_static(tagged: str, clean: str, subject: str, save_dir: str) -> str:
    """
    Writes a JSON file with subject, raw text, clean text, timestamp.
    Returns . 
    """
    save_dir.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    safe = re.sub(r'[^\w-]', '_', subject.lower())[:50] or "story"
    filename = f"{timestamp}_{safe}.json"
    filepath = save_dir / filename
    payload = {
        'subject': subject,
        'raw': raw,
        'clean': clean,
        'timestamp': timestamp
    }
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    clean_story = payload.clean
    subject = payload.subject
    
    return str(clean_story, subject)

def _save_speech_file_to_static(content: bytes, filename: str, save_dir: Path) -> str:
    """
    Saves the speech mp3 audio content to a file in the specified directory.
    """
    save_dir.mkdir(parents=True, exist_ok=True)
    
    filepath = save_dir / filename
    with open(filepath, "wb") as f:
        f.write(content)
        
    audio_filepath = filepath.relative_to(save_dir.parent)
        
    return str(audio_filepath))
