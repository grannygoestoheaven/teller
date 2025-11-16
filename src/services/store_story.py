import os, json
import re
from flask import current_app

from datetime import datetime

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
