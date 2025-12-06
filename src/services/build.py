from fastapi import HTTPException

from src.services.modes.story.text import generate_story_with_openai
from src.services.modes.story.tts import openai_tts
from src.services.storage import save_story_txt_to_json_file, save_mp3_speech_file, get_clean_story_from_json_file, get_story_title_from_json_file, get_speech_url, get_random_track_url

from src.config.settings import GENERATED_STORIES_DIR, LOCAL_TRACKS_DIR

def build_story(subject: str) -> dict:
    # genereate story and speech files
    story_filename = subject
    story_title, tagged_story_for_tts, story = generate_story_with_openai(subject) # returns text files
    speech_filename, speech_audio = openai_tts(tagged_story_for_tts, subject) # one text file, one bytes file (mp3)
    print(f"Generated speech filename: {speech_filename}")
    
    # store files and get their paths
    json_story_filepath = save_story_txt_to_json_file(subject, story_title, tagged_story_for_tts, story, GENERATED_STORIES_DIR) # store the story parameters on the server and returns the clean story file
    print(f"Saved story JSON filepath: {json_story_filepath}")
    speech_filepath = save_mp3_speech_file(speech_filename, speech_audio, GENERATED_STORIES_DIR) # store the speech audio file and returns its path
    print(f"Saved speech path: {speech_filepath}")
    
    # get the path for a random local ambient track
    track_path = get_random_track_path(LOCAL_TRACKS_DIR) # returns the path of local ambient track
    track_filename = track_path.split('/')[-1] if track_path else None # get only the filename; last part of the path
    clean_track_title = track_filename.replace(".mp3", "").replace("_", " ").title() if track_filename else None
    print(f"Selected track filename: {clean_track_title}")
    
    # Get audio urls for the payload:
    speech_url = f"/static/stories/{subject}/{speech_filename}"
    track_url = f"/static/audio/local_ambient_tracks/{track_filename}"
    print(f"Speech URL: {speech_url}, Track URL: {track_url}")
    
    frontend_payload = {
        "storyFilename": story_filename,
        "storyTitle": story_title,
        "story": story,
        "speechUrl": speech_url,
        "trackUrl": track_url,
        "trackTitle": track_title
    }
    
    print(f"Payload constructed: {payload}")
    
    return payload

def load_story (subject: str):
    # load an existing story from the stored json and speech files
    try:
        print(subject)
        story_filename = subject
        story_title = get_story_title_from_json_file(story_filename)
        print(story_title)
        print(f"Story filename: {story_filename}", f"Story title: {story_title}")
        story = get_clean_story_from_json_file(story_filename)
        
        speech_url = get_speech_url(story_filename) # path to already existing generated speech audio file
        
        track_path = get_random_track_url(LOCAL_TRACKS_DIR) # returns the path of local ambient track
        track_filename = track_path.split('/')[-1] if track_path else None
        track_url = f"/static/audio/local_ambient_tracks/{track_filename}" # path to already existing generated ambient track file
        track_title = track_filename.replace(".mp3", "").replace("_", " ").title() if track_filename else None
        
        # payload for the frontend - camelCase aliases for the keys are defined in the StoryResponse schema
        frontend_payload = {
            "storyFilename": story_filename,
            "storyTitle": story_title,
            "story": story,
            "speechUrl": speech_url,
            "trackUrl": track_url,
            "trackTitle": track_title
        }
    
        print(f"Payload constructed: {frontend_payload}")
        
    except Exception as e:
        print(f"Error loading story: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return frontend_payload
