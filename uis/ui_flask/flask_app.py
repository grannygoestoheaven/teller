import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify

# from src.teaicher.config import patterns
from src.teaicher.data.get_track_duration import get_track_duration, extract_service_name
from src.teaicher.services.get_story_length import get_spotify_story_length, get_youtube_story_length, get_user_story_length
from src.teaicher.services.generate_story import generate_story
from src.teaicher.services.text_to_speech import openai_text_to_speech, elevenlabs_text_to_speech
from src.teaicher.services.play_audio import play_audio, play_audio_with_sync

app = Flask(__name__)

# Load environment variables
load_dotenv()

eleven_labs_api_key = os.environ.get("ELEVEN_LABS_API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_story', methods=['POST'])
def generate_story_ui():
    subject = request.form['subject']
    user_length = int(request.form['length'])
    track_url = request.form['track_url']

    estimated_chars = get_user_story_length(user_length) # returns estimated_chars
        
    # Read the pattern and inject the variable directly
    with open('src/teaicher/config/patterns/insightful_brief.md', 'r') as file:
        pattern = file.read() # Default pattern content
        
        # Pass the estimated_chars into the pattern
        pattern = pattern.replace("{subject}", str(subject))
        pattern = pattern.replace("{estimated_chars}", str(estimated_chars))

    # Step 4: Generate Story
    story, filename = generate_story(subject, pattern, estimated_chars)

    # Step 5: Generate Speech
    # speech_audio = elevenlabs_text_to_speech(story)
    speech_audio = openai_text_to_speech(story)

    # Step 6: Sync Audio
    if track_url:
        play_audio_with_sync(track_url, speech_audio)
    else:
        play_audio(speech_audio)

    # return jsonify({"story": story, "audio_link": "path/to/speech_audio.mp3"})  # Adjust path as needed
    return render_template("index.html", story=story, audio_link=filename)


if __name__ == "__main__":
    app.run(debug=True)
