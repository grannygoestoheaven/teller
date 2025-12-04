from fastapi import HTTPException

from src.services.modes.story.text import generate_story_with_openai
from src.services.modes.story.tts import openai_tts
from src.services.storage import save_story_txt_to_static, save_speech_file_to_static, get_clean_story_from_json_file, get_story_filenames, get_speech_url, get_random_track_path

from src.config.settings import GENERATED_STORIES_DIR, LOCAL_TRACKS_DIR

def build_story(subject: str) -> dict:
    # genereate story and speech files
    story_filename, clean_story_title, tagged_story_for_tts, clean_story = generate_story_with_openai(subject) # returns text files
    print(f"Generated story filename: {story_filename}")
    speech_filename, speech_audio = openai_tts(tagged_story_for_tts, subject) # one text file, one bytes file (mp3)
    print(f"Generated speech filename: {speech_filename}")
    
    # store files and get their paths
    json_story_filepath = save_story_txt_to_static(story_filename, clean_story_title, tagged_story_for_tts, clean_story, GENERATED_STORIES_DIR) # store the story parameters on the server and returns the clean story file
    print(f"Saved story JSON filepath: {json_story_filepath}")
    speech_path = save_speech_file_to_static(speech_filename, speech, GENERATED_STORIES_DIR) # store the speech audio file and returns its path
    print(f"Saved speech path: {speech_path}")
    
    # get the path for a random local ambient track
    track_path = get_random_track_path(LOCAL_TRACKS_DIR) # returns the path of local ambient track
    
    # Extract the filename from the full path
    track_filename = track_path.split('/')[-1] if track_path else None # get only the filename; last part of the path
    clean_track_title = track_filename.replace(".mp3", "").replace("_", " ").title() if track_filename else None
    print(f"Selected track filename: {clean_track_title}")
    
    # Get urls for the payload:
    speech_url = f"/static/stories/{story_filename}/{speech_filename}"
    track_url = f"/static/audio/local_ambient_tracks/{track_filename}"
    print(f"Speech URL: {speech_url}, Track URL: {track_url}")
    
    payload = {
        "clean_story_title": clean_story_title,
        "clean_story": clean_story,
        "speech_url": speech_url,
        "track_url": track_url,
        "track_display_title": clean_track_title
    }
    
    print(f"Payload constructed: {payload}")
    
    return payload

def load_story (subject: str):
    try:
        print(f"Loading story for subject: {subject}")
        story_filename = get_story_filenames(subject)
        print(f"Story filename: {story_filename}")
        clean_story = get_clean_story_from_json_file(story_filename)
        speech_url = f"/static/stories/{story_filename}/{story_filename}.mp3" # path to already existing generated speech audio file
        track_filename = track_path.split('/')[-1] if track_path else None
        track_url = f"/static/audio/local_ambient_tracks/{track_filename}" # path to already existing generated ambient track file
        
        story_display_filename = story_filename.replace("_", " ").title()
        clean_track_title = track_filename.replace("_", " ").title()
        
        payload = {
            "clean_story_title": clean_story_title,
            "cleaned_story": cleaned_story,
            "speech_url": speech_url,
            "track_url": track_url,
            "clean_track_title": clean_track_title
        }
    
        print(f"Payload constructed: {payload}")
        
    except Exception as e:
        print(f"Error loading story: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return payload
