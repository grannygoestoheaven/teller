import os
import tempfile
import random

from openai import OpenAI  # OpenAI API client
from elevenlabs.client import ElevenLabs # ElevenLabs API client
# from TTS.api import TTS

# Initialize the TTS model (using a common English model)
# This assumes you have the model downloaded or it will download it.
# You might need to choose a different model based on your needs and installed models.
# tts = TTS("tts_models/en/ljspeech/tacotron2-DDC", gpu=False) # Set gpu=True if you have a CUDA-enabled GPU

GENERATED_STORIES_SUBDIR = 'audio/generated_stories'

def _add_ssml_breaks(text: str, pause_ms: int = 500) -> str:
    """Add SSML break tags between sentences.
    
    Args:
        text: Input text to process
        pause_ms: Duration of pause in milliseconds between sentences
        
    Returns:
        Text with SSML break tags added between sentences
    """
    import re
    # Split into sentences while preserving the delimiters
    sentences = re.split('([.!?] +)', text)
    # Join with SSML break tags
    processed = ''
    for i in range(0, len(sentences)-1, 2):
        processed += sentences[i]
        if i+1 < len(sentences):
            processed += sentences[i+1]
        processed += f'<break time="{pause_ms}ms"/>'
    return processed

def openai_text_to_speech(story: str, filename: str, pause_between_sentences_ms: int = 500) -> str:
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
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    try:
        # Ensure the input text is not empty and is a string
        if not story or not isinstance(story, str):
            raise ValueError("Story text must be a non-empty string")
            
        response = client.audio.speech.create(
            model="tts-1-hd",
            voice="onyx",
            input=story.strip(),  # Ensure we're passing a clean string
            response_format="mp3",
            speed=1.0,
        )
        
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
