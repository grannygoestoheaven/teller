import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi

# from src.teaicher.config import patterns
from src.teaicher.data.get_track_duration import get_track_duration, extract_service_name
from src.teaicher.services.get_story_length import get_spotify_story_length, get_youtube_story_length, get_user_story_length
from src.teaicher.services.generate_story import generate_story
from src.teaicher.services.choose_style import choose_style
from src.teaicher.services.get_video_transcript import get_youtube_transcript
from src.teaicher.services.text_to_speech import openai_text_to_speech, elevenlabs_text_to_speech
from src.teaicher.services.play_audio import play_audio, play_audio_with_sync, play_audio_with_sync_ffmpeg

app = Flask(__name__)

# Load environment variables
load_dotenv()

eleven_labs_api_key = os.environ.get("ELEVEN_LABS_API_KEY")

@app.route('/')
def index():
    # return render_template('index.html')
    return render_template('index_2.html')

@app.route('/generate_story', methods=['POST'])
def generate_story_ui():
    subject = request.form['subject']
    user_length = int(request.form['duration'])
    video_to_summarize_url = request.form.get['video_url']
    track_url = request.form.get('track_url') # Use .get() to avoid KeyError if not present
    track_path_form = request.files.get('track_path')
    option = request.form.get('option') # Get the value of the button that was clicked
    transcript_data = get_youtube_transcript(video_id)

    # if transcript_data:
    #     for segment in transcript_data:
    #         print(f"[{segment['start']:.2f} - {segment['start'] + segment['duration']:.2f}] {segment['text']}")


    # subject = request.form['subject']
    # user_length = int(request.form['duration'])
    # track_url = request.form['track_url']
    # news_option = button('News Version')

    # track_path = "/Users/grannygoestoheaven/code/computer science projects/teaicher/src/static/audio/Leaf_Bed.mp3"
    # news_background_track_uri = "https://www.youtube.com/watch?v=YF3pj_3mdMc"
    # track_path = request.files.get('track_path')

    estimated_chars = get_user_story_length(user_length) # returns estimated_chars
    pattern = choose_style(option)
    
    # Step 4: Generate Story
    if subject:
        story, filename = generate_story(subject, pattern, estimated_chars)
    elif video_to_summarize_url:
        story, filename = generate_story(transcript_data, pattern, estimated chars)

    # Step 5: Generate Speech
    # speech_audio = elevenlabs_text_to_speech(story)

    # Step 6: Sync Audio
    if track_url:
        speech_file_path = openai_text_to_speech(story)
        play_audio_with_sync(speech_file_path, track_url)
    elif track_path:
        speech_file_path = openai_text_to_speech(story)
        play_audio_with_sync(speech_file_path, track_path)
    else:
        speech_file_path = openai_text_to_speech(story)
        play_audio(speech_file_path)

    # return jsonify({"story": story, "audio_link": "path/to/speech_file_path.mp3"})  # Adjust path as needed
    return render_template("index_2.html", story=story, audio_link=filename)

if __name__ == "__main__":
    app.run(debug=True)
