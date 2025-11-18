import os
import json
import re

from fastapi import Request
from datetime import datetime

from src.config import settings

BASE = os.path.join(os.path.dirname(__file__), '..', '..', 'static', 'audio', 'generated_stories')
os.makedirs(BASE, exist_ok=True)

def save_story_to_static(subject: str, raw: str, clean: str) -> str:
    """
    Writes a JSON file with subject, raw text, clean text, timestamp.
    Returns the filename for reference.
    """
    
    timestamp = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    safe = re.sub(r'[^\w-]', '_', subject.lower())[:50] or "story"
    filename = f"{timestamp}_{safe}.json"
    path = os.path.join(BASE, filename)

    payload = {
        'subject': subject,
        'raw':     raw,
        'clean':   clean,
        'timestamp': timestamp
    }
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    return filename

def save_speech_file(content: bytes, filename: str, save_dir: Path) -> str:
    save_dir.mkdir(parents=True, exist_ok=True)
    filepath = save_dir / filename
    with open(filepath, "wb") as f:
        f.write(content)
    return str(path.relative_to(save_dir.parent))