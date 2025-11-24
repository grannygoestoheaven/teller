from fastapi import HTTPException

from src.services.modes.story.text import generate_story_with_openai
from src.services.modes.story.tts import openai_tts
from src.services.storage import save_story_txt_to_static, save_speech_file_to_static, get_clean_story_url_from_json_file
from src.services.data.local_tracks import get_random_track_path

from src.config.settings import GENERATED_STORIES_TEXT_DIR, GENERATED_STORIES_AUDIO_DIR, LOCAL_TRACKS_DIR

def build_story(subject: str) -> dict:
    # genereate story and speech files
    story_filename, tagged_story_for_tts, cleaned_story = generate_story_with_openai(subject) # returns text files
    print(f"Generated story filename: {story_filename}")
    speech_filename, speech = openai_tts(tagged_story_for_tts, subject) # one text file, one bytes file
    print(f"Generated speech filename: {speech_filename}")
    
    # store files and get their paths
    json_story_filepath = save_story_txt_to_static(tagged_story_for_tts, cleaned_story, story_filename, GENERATED_STORIES_TEXT_DIR) # store the story parameters on the server and returns path of the json story file
    print(f"Saved story JSON filepath: {json_story_filepath}")
    story_path = get_clean_story_url_from_json_file(json_story_filepath) # get the path of the cleaned story only, from the json story file, and pass it to the payload
    print(f"Retrieved clean story path: {story_path}")
    speech_path = save_speech_file_to_static(speech_filename, speech, GENERATED_STORIES_AUDIO_DIR) # store the speech audio file and returns its path
    print(f"Saved speech path: {speech_path}")
    track_path = get_random_track_path(LOCAL_TRACKS_DIR) # returns the path of local ambient track
    # Extract the filename from the full path
    track_filename = track_path.split('/')[-1] if track_path else None
    print(f"Selected track filename: {track_filename}")

    # Get urls for the payload:
    story_url = f"/static/audio/generated_stories/text/{story_filename}"
    speech_url = f"/static/audio/generated_stories_audio/{speech_filename}"
    track_url = f"/static/audio/local_ambient_tracks/{track_filename}"
    
    print(f"Story URL: {story_url}, Speech URL: {speech_url}, Track URL: {track_url}")

    payload = {
        "story_filename": story_filename,
        "story_url": story_url,
        "speech_url": speech_url,
        "track_url" : track_url
    }
    print(f"Payload constructed: {payload}")
    
    return payload
