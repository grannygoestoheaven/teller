import os
import tempfile

from openai import OpenAI  # OpenAI API client
from elevenlabs.client import ElevenLabs # ElevenLabs API client

def openai_text_to_speech(story: str, filename: str = "story.mp3") -> str:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    # styled_input = "(Speed of speech = slow) " + story

    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        # model="tts-1",
        voice="fable",
        input=story
    )

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp.write(response.content)
        
    return tmp.name  # return path to temp file

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
