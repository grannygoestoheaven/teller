from fastapi import HTTPException

from src.services.modes.story.text import generate_story_with_openai
from src.services.modes.story.tts import openai_tts
from src.services.storage import save_story_txt_to_static, save_speech_file_to_static, get_clean_story_from_json_file, get_story_filenames, get_speech_url, get_random_track_path

from src.config.settings import GENERATED_STORIES_DIR, LOCAL_TRACKS_DIR

def build_story(subject: str) -> dict:
    # genereate story and speech files
    story_filename, tagged_story_for_tts, cleaned_story = generate_story_with_openai(subject) # returns text files
    print(f"Generated story filename: {story_filename}")
    speech_filename, speech = openai_tts(tagged_story_for_tts, subject) # one text file, one bytes file
    print(f"Generated speech filename: {speech_filename}")
    
    # store files and get their paths
    json_story_filepath = save_story_txt_to_static(tagged_story_for_tts, cleaned_story, story_filename, GENERATED_STORIES_DIR) # store the story parameters on the server and returns path of the json story file
    print(f"Saved story JSON filepath: {json_story_filepath}")
    speech_path = save_speech_file_to_static(speech_filename, speech, GENERATED_STORIES_DIR) # store the speech audio file and returns its path
    print(f"Saved speech path: {speech_path}")
    track_path = get_random_track_path(LOCAL_TRACKS_DIR) # returns the path of local ambient track
    
    # Get urls for the payload:
    speech_url = f"/static/stories/{story_filename}/{speech_filename}.mp3"
    track_url = f"/static/audio/local_ambient_tracks/{track_filename}"
    print(f"Speech URL: {speech_url}, Track URL: {track_url}")
    
    # Extract the filename from the full path
    track_filename = track_path.split('/')[-1] if track_path else None
    print(f"Selected track filename: {track_filename}")

    payload = {
        "story_filename": story_filename,
        "story_clean": cleaned_story,
        "speech_url": speech_url,
        "track_url": track_url,
        "track_filename": track_filename
    }
    
    print(f"Payload constructed: {payload}")
    
    return payload

def load_story (subject: str):
    try:
        print(f"Loading story for subject: {subject}")
        story_filename = get_story_filenames(subject)
        print(f"Story filename: {story_filename}")
        story_clean = get_clean_story_from_json_file(story_filename)
        speech_url = f"/static/stories/{story_filename}/{speech_filename}.mp3" # path to already existing generated text file
        track_url = f"/static/audio/local_ambient_tracks/{track_filename}" # path to already existing generated audio file
        track_filename = track_url.split('/')[-1] if track_url else None
        
        payload = {
            "story_filename": story_filename,
            "cleaned_story": cleaned_story,
            "speech_url": speech_url,
            "track_url": track_url,
            "track_filename": track_filename
        }
        
    except Exception as e:
        print(f"Error loading story: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return payload

