import os
import openai

from dotenv import load_dotenv
load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=openai_api_key)

text1 = "I’m so happy to see you. But something feels wrong. I don’t know why."
text2 = "I’m so happy to see you... But... something feels wrong... I don’t know why..."

for i, text in enumerate([text1, text2], start=1):
    response = client.audio.speech.create(
        model="tts-1",
        voice="shimmer",
        input=text,
        speed=1.0
    )
    with open(f"output_{i}.mp3", "wb") as f:
        f.write(response.read())

