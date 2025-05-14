import os
import tempfile

from openai import OpenAI  # OpenAI API client
from elevenlabs.client import ElevenLabs # ElevenLabs API client
# from TTS.api import TTS

# Initialize the TTS model (using a common English model)
# This assumes you have the model downloaded or it will download it.
# You might need to choose a different model based on your needs and installed models.
# tts = TTS("tts_models/en/ljspeech/tacotron2-DDC", gpu=False) # Set gpu=True if you have a CUDA-enabled GPU

GENERATED_STORIES_SUBDIR = 'audio/generated_stories'

def openai_text_to_speech(story: str, filename: str) -> str:
    """
    Generates speech from text using OpenAI's TTS and saves it to a static directory.

    Args:
        story: The text content of the story.
        filename: The desired filename for the audio (e.g., 'my_story.mp3').

    Returns:
        The path to the saved audio file relative to the 'static' directory
        (e.g., 'audio/generated_stories/my_story.mp3'), or None on error.
    """
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    try:
        response = client.audio.speech.create(
            model="tts-1-hd",
            voice="onyx",
            input=story,
            instructions='''
                            Tone : very reassuring, extremely soft, low, discreet.
                            Pacing : fast, with double long silences between
                            sentences.
                            ''',
            speed=1,
        )

        # Determine the absolute path to the static directory
        # Assuming this script is in src/teaicher/services,
        # static_dir is ../../../static
        current_script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.abspath(os.path.join(current_script_dir, '..', '..', '..'))
        static_dir_abs_path = os.path.join(project_root, 'static')
        
        save_dir = os.path.join(static_dir_abs_path, GENERATED_STORIES_SUBDIR)
        os.makedirs(save_dir, exist_ok=True)

        speech_file_abs_path = os.path.join(save_dir, filename)

        with open(speech_file_abs_path, 'wb') as f:
            f.write(response.content)

        # Return path relative to static directory for url_for()
        speech_file_relative_path = os.path.join(GENERATED_STORIES_SUBDIR, filename)
        return speech_file_relative_path

    except Exception as e:
        # Log the error appropriately in a real application
        print(f"Error in openai_text_to_speech: {e}")
        return None

def openai_text_to_speech_chill(story: str, filename: str) -> str:
    """Similar to openai_text_to_speech but saves to static dir and uses different instructions."""
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    try:
        response = client.audio.speech.create(
            # model="gpt-4o-mini-tts",
            model="tts-1-hd", # Using tts-1-hd like the primary function for consistency
            voice="onyx",
            input=story,
            instructions='''Voice: Laid-back, mellow, and effortlessly cool, like a surfer who's never in a rush.
                            Tone: Relaxed and reassuring, keeping things light even when the customer is frustrated.
                            Speech Mannerisms: Uses casual, friendly phrasing with surfer slang like dude, gnarly, and boom to keep the conversation chill.
                            Pronunciation: Soft and drawn-out, with slightly stretched vowels and a naturally wavy rhythm in speech.
                            Tempo: Slow and easygoing, with a natural flow that never feels rushed.
                            ''',
            speed=1
        )
        current_script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.abspath(os.path.join(current_script_dir, '..', '..', '..'))
        static_dir_abs_path = os.path.join(project_root, 'static')
        
        save_dir = os.path.join(static_dir_abs_path, GENERATED_STORIES_SUBDIR)
        os.makedirs(save_dir, exist_ok=True)
        speech_file_abs_path = os.path.join(save_dir, filename)

        with open(speech_file_abs_path, 'wb') as f:
            f.write(response.content)
        
        speech_file_relative_path = os.path.join(GENERATED_STORIES_SUBDIR, filename)
        return speech_file_relative_path
    except Exception as e:
        print(f"Error in openai_text_to_speech_chill: {e}")
        return None

def openai_text_to_speech_hesitation(story: str, filename: str) -> str:
    """Similar to openai_text_to_speech but saves to static dir and uses different instructions."""
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    try:
        response = client.audio.speech.create(
            # model="gpt-4o-mini-tts",
            model="tts-1-hd", # Using tts-1-hd like the primary function for consistency
            voice="onyx",
            input=story,
            instructions='''Affect: Invasive, secret.
                            Voice Affect: curiosity and a bit of frustration.
                            Tone: Trying to convice, a bit creepy.
                            Pronunciation: Unclear and vague, drunk.
                            Pacing: hurried.
                            ''',
            speed=1
        )
        current_script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.abspath(os.path.join(current_script_dir, '..', '..', '..'))
        static_dir_abs_path = os.path.join(project_root, 'static')
        
        save_dir = os.path.join(static_dir_abs_path, GENERATED_STORIES_SUBDIR)
        os.makedirs(save_dir, exist_ok=True)
        speech_file_abs_path = os.path.join(save_dir, filename)

        with open(speech_file_abs_path, 'wb') as f:
            f.write(response.content)
        
        speech_file_relative_path = os.path.join(GENERATED_STORIES_SUBDIR, filename)
        return speech_file_relative_path
    except Exception as e:
        print(f"Error in openai_text_to_speech_hesitation: {e}")
        return None

def elevenlabs_text_to_speech(story: str, filename: str = "story.mp3") -> None :
    # Set the path and create folder if needed
    static_audio_path = os.path.join('static', 'audio', filename)

    # Ensure the directory exists
    os.makedirs(os.path.dirname(static_audio_path), exist_ok=True)

    # Initialize client
    client = ElevenLabs(api_key=os.environ.get("ELEVEN_LABS_API_KEY"))

    # Define the text and parameters
    text = story
    voice_id = "JBFqnCBsd6RMkjVDRZzb"  # Replace with your voice ID
    model_id = "eleven_multilingual_v2"

    # Generate speech
    audio = client.text_to_speech.convert(
        text=text,
        voice_id=voice_id,
        model_id=model_id,
        output_format="mp3_22050_32"
    )
    
    audio_bytes = b"".join(audio)
    # we could return the audio bytes here, but we'll save it to a file instead

    # Save the audio
    with open("output.mp3", "wb") as file:
        file.write(audio_bytes)
    
    # Return the audio bytes    
    with open("output.mp3", "rb") as f:
        audio_bytes = f.read()
    
    return audio_bytes

def tts_text_to_speech(story: str, filename: str = "story.mp3") -> str:
    # Set path and create folder if needed
    static_audio_path = os.path.join('static', 'audio', filename)
    os.makedirs(os.path.dirname(static_audio_path), exist_ok=True)

    # Create and save audio
    audio_bytes = tts.text_to_speech(story)

    with open(static_audio_path, 'wb') as f:
        f.write(audio_bytes)

    return static_audio_path
