import re

# helper functions for parameters, track selection, and story generation
def _prepare_story_parameters(request_form):
    return subject

def _format_text_filename(raw_title: str) -> str:
    return raw_title.lower().replace(" ", "_").replace("'", "")

def _format_mp3_filename(raw_title: str, max_length: int = 200) -> str:
    """Generate an mp3 filename from a raw title."""
    if not raw_title or not isinstance(raw_title, str):
        return "mistral_story.mp3"
        
    # Convert to lowercase and replace spaces
    filename = format_text_filename(raw_title)
    # Remove any non-alphanumeric characters except dots, dashes and underscores
    filename = "".join(c for c in filename if c.isalnum() or c in ('.', '_', '-')).rstrip()
    
    # Ensure .mp3 extension
    if not filename.endswith(".mp3"):
        filename += ".mp3"
    
    # Handle edge cases
    if len(filename) > max_length:
        filename = filename[:max_length - 4] + ".mp3"
    if filename == ".mp3":
        return "mistral_story.mp3"
        
    return filename

def _clean_story_text(story: str) -> str:
    """
    Clean the story text by removing <[silence]> tags and ensuring proper punctuation. The goal is to have
    a well-formed story with sentences ending in periods, and to remove unnecessary whitespace.
    """
    if not story:
        return story
    cleaned = re.sub(r'<\[silence]>(\s*)', lambda m: ' ' if m.group(1) else '', story)
    cleaned = re.sub(r'([a-z])(\s*\n|$)', r'\1.\2', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\.\.+', '.', cleaned)
    cleaned = re.sub(r'\.([^ \n])', r'. \1', cleaned)
    return cleaned.strip()
