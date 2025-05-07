import os
from dotenv import load_dotenv
from flask import Flask, render_template, request

from src.teaicher.data.get_track_duration import get_track_duration, extract_service_name
from src.teaicher.services.get_story_length import get_user_story_length
from src.teaicher.services.generate_story import generate_story
from src.teaicher.services.text_to_speech import openai_text_to_speech, openai_text_to_speech_hesitation, openai_text_to_speech_chill
from src.teaicher.services.play_audio import play_audio, play_audio_with_sync, play_audio_with_stereo_effect

app = Flask(__name__)
load_dotenv()

@app.route('/')
def index():
    return render_template('index_7.html')

@app.route('/generate_story', methods=['POST'])
def teller_ui():
    subject = request.form['subject']
    # user_length = int(request.form['duration'])
    user_length = 1
    genre = request.form.get('genre')
    
    estimated_chars = get_user_story_length(user_length)
    
    if genre == "monologue" or genre == "chill":
        track_path = "/Users/grannygoestoheaven/code/computer science projects/teaicher/src/static/audio/New_York_Sounds.mp3"
        with open('src/teaicher/config/patterns/pub_monologue.md', 'r') as file:
            pattern = file.read().replace("{subject}", str(subject)).replace("{estimated_chars}", str(estimated_chars))
            story, filename = generate_story(subject, pattern, estimated_chars)
            if genre == "chill":
                speech_file_path = openai_text_to_speech_chill(story)
            else:
                speech_file_path = openai_text_to_speech_hesitation(story)
    elif genre == "news":
        track_path = "/Users/grannygoestoheaven/code/computer science projects/teaicher/src/static/audio/New_York_Sounds.mp3"
        with open('src/teaicher/config/patterns/news.md', 'r') as file:
            pattern = file.read().replace("{subject}", str(subject)).replace("{estimated_chars}", str(estimated_chars))
            story, filename = generate_story(subject, pattern, estimated_chars)
            speech_file_path = openai_text_to_speech(story)
    else:
        track_path = "/Users/grannygoestoheaven/code/computer science projects/teaicher/src/static/audio/Leaf_Bed.mp3"
        with open('src/teaicher/config/patterns/insightful_brief.md', 'r') as file:
            pattern = file.read().replace("{subject}", str(subject)).replace("{estimated_chars}", str(estimated_chars))
            story, filename = generate_story(subject, pattern, estimated_chars)
            speech_file_path = openai_text_to_speech(story)

    play_audio_with_sync(speech_file_path, track_path)
    # play_audio_with_stereo_effect(speech_file_path, track_path)

    # Detect AJAX/fetch request
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
        from flask import jsonify
        return jsonify({"story": story, "audio_link": filename})
    else:
        return render_template("index_7.html", story=story, audio_link=filename)

if __name__ == "__main__":
    app.run(debug=True)