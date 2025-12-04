import re

# helper functions for parameters, track selection, and story generation
def _prepare_story_parameters(request_form):
    return subject

def _format_text_filename(subject: str) -> str:
    """Generate a text filename with underscores from a raw subject"""
    return re.sub(r'[^\w\-_]', '_', subject.strip().lower())

def _format_mp3_filename(subject: str, max_length: int = 200) -> str:
    """Generate an mp3 filename with underscores from a raw subject."""
    if not subject or not isinstance(subject, str):
        return "mistral_story.mp3"
        
    mp3_filename = re.sub(r'[^\w\-_]', '_', subject.strip().lower())
    
    # Ensure .mp3 extension
    if not mp3_filename.endswith(".mp3"):
        mp3_filename += ".mp3"
    
    # Handle edge cases
    if len(mp3_filename) > max_length:
        mp3_filename = mp3_filename[:max_length - 4] + ".mp3"
    if mp3_filename == ".mp3":
        return "mistral_story.mp3"
        
    return mp3_filename

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

def _clean_story_filename(subject: str) -> str:
    """Generate a clean story filename with spaces from an underscored filename."""
    if not subject or not isinstance(subject, str):
        return "Mistral Story"
    return subject.replace("_", " ").title()
