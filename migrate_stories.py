import os
import json
import re
from pathlib import Path

def _clean_story_filename(filename: str) -> str:
    """Strip timestamp and clean the filename for story_title."""
    if not filename or not isinstance(filename, str):
        return "mistral story"
    # Remove timestamp prefix (e.g., "20251128T230121Z_") and extension
    cleaned = re.sub(r'^\d{T8}Z_', '', filename)
    cleaned = cleaned.replace('.json', '').replace('_', ' ')
    return cleaned.lower()

def migrate_json_file(json_path: Path):
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Extract story_filename from the parent folder name
    story_filename = json_path.parent.name
    story_title = _clean_story_filename(story_filename)

    new_data = {
        "story_filename": story_filename,
        "story_title": story_title,
        "tagged_story_for_tts": data.get("tagged", data.get("tagged_story_for_tts", "")),
        "clean_story": data.get("clean", data.get("clean_story", "")),
        "timestamp": data.get("timestamp", "")
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(new_data, f, indent=2, ensure_ascii=False)

def migrate_all_json_files():
    root_dir = Path("static/stories")
    for story_dir in root_dir.iterdir():
        if story_dir.is_dir():
            json_path = story_dir / f"{story_dir.name}.json"
            if json_path.exists():
                migrate_json_file(json_path)
                print(f"Migrated: {json_path}")

if __name__ == "__main__":
    migrate_all_json_files()
