import os
import tempfile

from openai import OpenAI  # OpenAI API client
from elevenlabs.client import ElevenLabs # ElevenLabs API client

def openai_text_to_speech(story: str, to_bytes = False, filename: str = "story.mp3") -> str:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    # styled_input = "(Speed of speech = slow) " + story

    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        # model="tts-1-hd",
        # voice="ash",
        voice="onyx",
        input=story,
        # instructions='''Affect: Neutral.
        #                 Voice Affect: very soft and discrete, no real intonation; project indifference and tranquility.
        #                 Tone: Showing no emotion, just competence.
        #                 Pronunciation: Clear and precise.
        #                 Pacing: Efficient.
        #                 Rythm : Very long silences between sentences.
        #                 ''',
        instructions='''
                        Tone : very soft, low, reassuring, discreet.
                        Pacing : fast, with double long silences between
                        sentences.
                        ''',
        speed=1,
        # speed=0.5,    # Tone : wise
                        # Tone : soft, discreet, persuasive.
                        # Pronunciation : soft and drawn-out, with slightly stretched vowels and a naturally wavy rhythm in speech.
    )

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp.write(response.content)
    # if to_bytes:
    #     speech_file = response.content
    #     return response.content      
        speech_file_path = tmp.name
    return speech_file_path  # return path to temp file

def openai_text_to_speech_chill(story: str, to_bytes = False, filename: str = "story.mp3") -> str:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    # styled_input = "(Speed of speech = slow) " + story

    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        # model="tts-1-hd",
        voice="ash",
        input=story,
        instructions='''Voice: Laid-back, mellow, and effortlessly cool, like a surfer who's never in a rush.
                        Tone: Relaxed and reassuring, keeping things light even when the customer is frustrated.
                        Speech Mannerisms: Uses casual, friendly phrasing with surfer slang like dude, gnarly, and boom to keep the conversation chill.
                        Pronunciation: Soft and drawn-out, with slightly stretched vowels and a naturally wavy rhythm in speech.
                        Tempo: Slow and easygoing, with a natural flow that never feels rushed.
                        ''',
        speed=1
    )

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp.write(response.content)
    # if to_bytes:
    #     speech_file = response.content
    #     return response.content      
        speech_file_path = tmp.name
    return speech_file_path  # return path to temp file

def openai_text_to_speech_hesitation(story: str, to_bytes = False, filename: str = "story.mp3") -> str:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    # styled_input = "(Speed of speech = slow) " + story

    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        # model="tts-1-hd",
        voice="ash",
        input=story,
        instructions='''Affect: Invasive, secret.
                        Voice Affect: curiosity and a bit of frustration.
                        Tone: Trying to convice, a bit creepy.
                        Pronunciation: Unclear and vague, drunk.
                        Pacing: hurried.
                        ''',
        speed=1
    )

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp.write(response.content)
    # if to_bytes:
    #     speech_file = response.content
    #     return response.content      
        speech_file_path = tmp.name
    return speech_file_path  # return path to temp file

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
