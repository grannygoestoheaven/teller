from fastapi import HTTPException

from src.services.modes.story.text import generate_story_with_openai_jinja, generate_story_with_mistralai
from src.services.modes.story.tts import openai_tts
from src.services.storage import save_txt_to_json_file, save_mp3_speech_file, get_clean_text_from_json_file, get_tagged_text_from_json_file, get_text_title_from_json_file, get_speech_url, get_random_track_url

from src.config.settings import GENERATED_STORIES_DIR, LOCAL_TRACKS_DIR

def build_story(subject: str, narrative_style: str, difficulty: str) -> dict:
    print(subject)
    # the goal of this function is to call the generation functions, group their respective outputs (text files, audio files),
    # store them for later use and send their data and urls to the frontend.
    story_foldername = subject
    story_filename = subject
    
    print (subject, narrative_style, difficulty)

    story_title, tagged_story_for_tts, story = generate_story_with_mistralai(subject, narrative_style, difficulty) # returns text files
    print(f"Generated story: {story}")
    speech_filename, speech_audio = openai_tts(tagged_story_for_tts, subject) # one text file, one bytes file (mp3)
    print(f"Generated speech filename: {speech_filename}")
    
    # store files and get their paths
    json_story_filepath = save_txt_to_json_file(story_filename, story_title, tagged_story_for_tts, story, GENERATED_STORIES_DIR) # store the story parameters on the server and returns the clean story file
    # print(f"Saved story JSON filepath: {json_story_filepath}")
    speech_filepath = save_mp3_speech_file(story_foldername, speech_filename, speech_audio, GENERATED_STORIES_DIR) # store the speech audio file and returns its path
    print(f"Saved speech path: {speech_filepath}")
    
    # get the path for a random local ambient track
    track_filepath = get_random_track_url(LOCAL_TRACKS_DIR) # returns the path of local ambient track
    track_filename = track_filepath.split('/')[-1] if track_filepath else None # get only the filename; last part of the path
    track_title = track_filename.replace(".mp3", "").replace("_", " ").title() if track_filename else None
    print(f"Selected track title: {track_title}")
    
    # Get audio urls for the payload:
    speech_url = f"/static/stories/{story_filename}/{speech_filename}"
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
    
    print(f"Payload constructed: {frontend_payload}")
    
    return frontend_payload

def load_story(subject: str, regenerate_mp3: bool) -> dict:
    # Load an existing story from stored JSON and speech files
    try:
        print(f"Loading story: {subject}")
        story_filename = subject
        story_foldername = subject
        story_title = get_text_title_from_json_file(story_filename)
        print(f"Story filename: {story_filename}, Story title: {story_title}")

        story = get_clean_text_from_json_file(story_filename)
        tagged_story_for_tts = get_tagged_text_from_json_file(story_filename)  # Add this helper if needed

        # Check if MP3 exists; regenerate if missing and flag is True
        mp3_path = GENERATED_STORIES_DIR / story_filename / f"{story_filename}.mp3"
        if regenerate_mp3 and not mp3_path.exists():
            print(f"MP3 missing for {story_filename}. Regenerating...")
            speech_filename, speech_audio = openai_tts(tagged_story_for_tts, subject)  # Your TTS function
            save_mp3_speech_file(story_foldername, speech_filename, speech_audio, GENERATED_STORIES_DIR)

        # URLs only (no filesystem paths)
        speech_url = f"/static/stories/{story_filename}/{story_filename}.mp3"

        track_path = get_random_track_url(LOCAL_TRACKS_DIR)
        track_filename = track_path.split('/')[-1] if track_path else None
        track_url = f"/static/audio/local_ambient_tracks/{track_filename}"
        track_title = track_filename.replace(".mp3", "").replace("_", " ").title() if track_filename else None

        # Frontend payload (camelCase aliases handled by StoryResponse)
        frontend_payload = {
            "storyFilename": story_filename,
            "storyTitle": story_title,
            "story": story,
            "speechUrl": speech_url,
            "trackUrl": track_url,
            "trackTitle": track_title
        }

        print(f"Payload constructed: {frontend_payload}")
        return frontend_payload

    except Exception as e:
        print(f"Error loading story: {e}")
        raise HTTPException(status_code=500, detail=str(e))
