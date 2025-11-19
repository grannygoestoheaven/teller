import os
import tempfile
import random

from src.schemas.tts import TtsRequest
from src.config.settings import Settings, GENERATED_STORIES_AUDIO
from src.services.storage import save_speech_file

from openai import OpenAI  # OpenAI API client
from elevenlabs.client import ElevenLabs # ElevenLabs API client

def openai_tts(story: TtsRequest, filename: str) -> str:
    """
    Generates speech from text using OpenAI's TTS and saves it to a static directory.

    Args:
        story: The text content of the story.
        filename: The desired filename for the audio (e.g., 'my_story.mp3').
        pause_between_sentences_ms: Duration of pause between sentences in milliseconds (default: 500ms).

    Returns:
        The path to the saved audio file relative to the 'static' directory
        (e.g., 'audio/generated_stories/my_story.mp3'), or None on error.
    """

    try:
        # Ensure the input text is not empty and is a string
        if not story or not isinstance(story, str):
            raise ValueError("Story text must be a non-empty string")
        
        response = client.audio.speech.create(
            # model="tts-1-hd-1106",
            # model="tts-1-hd",
            model="tts-1",
            voice="onyx",
            input=story.strip(),  # Ensure we're passing a clean string
            response_format="mp3",
            instructions='''
                        Tone : discreet, tired.
                        Pacing : fast, with controlled, double silences between sentences.
                        Emotional Range : peaceful
                        ''',
        )

        speech_file_relative_path = save_speech_file(response.content, filename, GENERATED_STORIES_AUDIO)
        return speech_file_relative_path

    except Exception as e:
        # Log the error appropriately in a real application
        print(f"Error in openai_text_to_speech: {e}")
        return None
    
def elevenlabs_text_to_speech(story: str) -> bytes:
    
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

def coqui_tts_text_to_speech(story: str, filename: str = "story.wav", model_name: str = "tts_models/en/ljspeech/glow-tts") -> str:
    """
    Generates speech from text using Coqui TTS and saves it to a static directory.

    Args:
        story: The text content of the story.
        filename: The desired filename for the audio (e.g., 'my_story.wav').
        model_name: The Coqui TTS model to use (default: 'tts_models/en/ljspeech/glow-tts').
                  Other options: 'tts_models/en/ljspeech/tacotron2-DDC', 'tts_models/en/ek1/tacotron2'

    Returns:
        The path to the saved audio file relative to the 'static' directory,
        or None if an error occurs.
    """
    try:
        from TTS.api import TTS
        import torch
        
        # Set device (use GPU if available)
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        
        # Initialize TTS with the specified model
        tts = TTS(model_name=model_name, progress_bar=False).to(device)
        
        # Create output directory if it doesn't exist
        if not filename.lower().endswith('.wav'):
            filename = f"{os.path.splitext(filename)[0]}.wav"
            
        output_path = os.path.join('static', GENERATED_STORIES_SUBDIR, filename)
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Generate and save speech
        tts.tts_to_file(text=story, file_path=output_path)
        
        # Return path relative to static directory
        return os.path.join(GENERATED_STORIES_SUBDIR, filename)
        
    except Exception as e:
        print(f"Error in Coqui TTS: {str(e)}")
        return None
