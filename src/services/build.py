from src.services.story.text import generate_story_with_openai
from src.services.story.tts import openai_tts
from src.services.storage import save_story_txt_to_static, save_speech_file_to_static, get_clean_story_url_from_json_file
from src.services.data.local_tracks import get_local_track_path

from src.config.settings import GENERATED_STORIES_TEXT_DIR, GENERATED_STORIES_AUDIO_DIR, LOCAL_TRACKS_DIR

def build_story(subject: str) -> dict:
    story_filename, tagged_story_for_tts, cleaned_story = generate_story_with_openai(subject) # returns text files
    print(f"Generated story filename: {story_filename}")
    speech_filename, speech = openai_tts(tagged_story_for_tts, subject) # returns bytes
    print(f"Generated speech filename: {speech_filename}")
    
    json_story_url = save_story_txt_to_static(tagged_story_for_tts, cleaned_story, story_filename, GENERATED_STORIES_TEXT_DIR) # store the story and returns url of the json story file
    speech_url = save_speech_file_to_static(speech, speech_filename, GENERATED_STORIES_AUDIO_DIR) # store the speech audio file and returns its url
    track_url = get_local_track_path(LOCAL_TRACKS_DIR) # returns a local track url
    print(json_story_url, speech_url, track_url)
    
    story = get_clean_story_url_from_json_file(story_filename, GENERATED_STORIES_TEXT_DIR) # get the cleaned story only from the json story file and pass it to the payload

    payload = {
        "StoryUrl": story,
        "fileName": filename,
        "speechUrl": speech_url,
        "trackUrl" : track_url
    }
    
    return payload
