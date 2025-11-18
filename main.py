from fastapi import FastAPI
from routers import story

import os
import re
import random
import glob
import json
import shutil
from datetime import datetime

from dotenv import load_dotenv

app = fastAPI()
app.include_router(story.router)     # Not used in current logic, kept for reference


@app.route('/generate_story', methods=['POST'])
def teller_ui():
    subject = _prepare_story_parameters(request.form)
    app_base_dir = os.path.dirname(__file__)
    
    # _generate_story_and_speech now handles track selection and returns its URL
    raw_story, story, display_filename, speech_file_static_path, track_url_for_client = \
        _generate_story_and_speech(subject, estimated_chars, PATTERN_FILE_PATH, app_base_dir, app.logger)

    audio_url_for_client = None
    if speech_file_static_path:
        audio_url_for_client = url_for('static', filename=speech_file_static_path)

    if not story:  # Only fail if story generation failed
        error_message = "Sorry, there was an error generating the story. Please try again."
        if not os.path.exists(PATTERN_FILE_PATH):
             error_message = "Sorry, the story pattern file is missing. Please contact support."
        
        app.logger.warning("Error response: Story generation failed.")

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
            return jsonify({"error": error_message}), 500
        else:
            return render_template("index.html", error=error_message), 500
            
    if not speech_file_static_path:
        app.logger.warning("TTS failed, but continuing with text-only story.")

    # Always provide audio_url and track_url to the client if available
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes['application/json']:
        response_data = {
            'story': story,
            'tagged_story': raw_story,
            'display_filename': display_filename,
            'has_audio': bool(audio_url_for_client),
            'speechUrl': audio_url_for_client, # Will be None if not generated
            'trackUrl': track_url_for_client # Will be None if not found
            #related subjects could be added here later
        }
        if story:
            saved_fname = save_story_to_server(subject, raw_story, story)
            response_data['server_filename'] = saved_fname
        return jsonify(response_data)
    else:
        return render_template(
            'index.html',
            story=story,
            audio_url=audio_url_for_client,
            track_url=track_url_for_client,
            display_filename=display_filename,
            has_audio=bool(audio_url_for_client)
        )

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=False)
