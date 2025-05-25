import os
import re
import vlc
import time
import tempfile
import subprocess
import threading
from urllib.parse import urlparse, parse_qs

from mutagen.mp3 import MP3
from pytube import YouTube

def is_youtube_url(url):
    """Check if the given URL is a YouTube URL."""
    youtube_regex = (
        r'(https?://)?(www\.)?'
        '(youtube|youtu|youtube-nocookie)\.(com|be)/'
        '(watch\?v=|embed/|v/|.+/|\?v=|&v=|\/v\/)?([^&\n\s?]+)'
    )
    return bool(re.match(youtube_regex, url))

def get_youtube_stream_url(youtube_url):
    """Extract the audio stream URL from a YouTube video."""
    try:
        yt = YouTube(youtube_url)
        audio_stream = yt.streams.filter(only_audio=True).order_by('abr').desc().first()
        if not audio_stream:
            print("No audio stream found for the YouTube video.")
            return None
        return audio_stream.url
    except Exception as e:
        print(f"Error getting YouTube stream: {e}")
        return None

def play_audio(speech_file_path: str) -> None:
    """
    Plays the speech audio from a file path.

    Args:
    - speech_file_path (str): Path to the audio file to play.
    """
    audio_metadata = MP3(speech_file_path)
    duration = audio_metadata.info.length
    
    # Create VLC media player
    speech_player = vlc.MediaPlayer(speech_file_path)

    # Start playback
    speech_player.play()

    # Wait a bit to let it start
    time.sleep(1)

    # Optional: wait for the audio to finish (~ rough estimate)
    # Can be improved with mutagen or VLC duration API
    time.sleep(duration + 2)

    speech_player.stop()

# def play_audio_with_sync(speech_file_path: str, track_path: str) -> None:
    """
    Plays a track and speech audio in sync, mixing the track at a lower volume.

    Args:
    - track_url (str): The URL or path of the track to play (optional).
    - speech_file_path (bytes): The audio data for speech to play.

    Returns:
    - tuple: (original speech bytes, path to speech temp file)
    """
    # import tempfile, vlc, time, os

    # # Save speech audio to a temporary file
    # with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as speech_file:
    #     speech_file.write(speech_file_bytes)
    #     speech_file_path = speech_file.name
    
    audio_metadata = MP3(speech_file_path)
    duration = audio_metadata.info.length

    # Create VLC players
    speech_player = vlc.MediaPlayer(speech_file_path)
    speech_player.audio_set_volume(100)
    
    # track_player = vlc.MediaPlayer(track_path)
    # track_player.audio_set_volume(30)

    # time.sleep(duration + 2)  # ~32000 bytes/sec for mp3_22050_32
    
    track_player.play()
    while not track_player.is_playing(): # Here we are handling buffering of the track that may take a while
        time.sleep(0.1)

    time.sleep(8)

    speech_player.play()
    while not speech_player.is_playing(): # Here we are handling buffering also
        time.sleep(0.1)

    # Wait for speech to finish
    time.sleep(duration + 4)

    # Fade out music
    fade_duration = 6  # seconds
    step_delay = 0.02  # seconds
    steps = int(fade_duration / step_delay)  # = 300 steps

    for i in range(steps):
        volume = round(30 * (1 - i / steps))
        track_player.audio_set_volume(max(volume, 0))
        time.sleep(step_delay)

    track_player.stop()
    speech_player.stop()

    # return speech_audio, speech_file_path

def play_audio_with_sync(speech_file_path: str, track_path: str) -> None:
    """
    Plays a track and speech audio in sync, mixing the track at a lower volume.
    Returns as soon as the speech ends, while the ambient music continues playing.

    Args:
    - speech_file_path (str): The path of the speech audio file to play.
    - track_path (str): The path or YouTube URL of the track to play.
    """
    try:
        audio_metadata = MP3(speech_file_path)
        duration = audio_metadata.info.length
    except Exception as e:
        print(f"Error reading speech file metadata: {e}")
        return

    # Create VLC instance and players
    instance = vlc.Instance()
    speech_player = instance.media_player_new()
    track_player = instance.media_player_new()

    # Set up media
    speech_media = instance.media_new(speech_file_path)
    track_media = instance.media_new(track_path)
    speech_player.set_media(speech_media)
    track_player.set_media(track_media)

    # Set volumes
    speech_player.audio_set_volume(90)
    track_player.audio_set_volume(50)  # Lower volume for ambient track

    # Start playing the ambient track
    track_player.play()
    time.sleep(0.1)  # Small delay to let it start

    # Wait for track to start playing (with timeout)
    start_time = time.time()
    while not track_player.is_playing() and time.time() - start_time < 5:
        time.sleep(0.1)
    if not track_player.is_playing():
        print("Warning: Track failed to start playing.")

    # Start the speech after a short delay
    time.sleep(8)  # Initial delay before speech starts
    speech_player.play()
    time.sleep(0.1)  # Small delay to let it start

    # Wait for speech to start playing (with timeout)
    start_time = time.time()
    while not speech_player.is_playing() and time.time() - start_time < 5:
        time.sleep(0.1)
    if not speech_player.is_playing():
        print("Warning: Speech failed to start playing.")

    # Wait for speech to finish (with a small buffer)
    time.sleep(duration + 1)
    
    # At this point, the speech has finished and we can return control to Flask
    # The ambient music will continue playing in the background
    
    # Start a separate thread to handle the music fade out
    def fade_out_music():
        # Let the music play for a while longer (30 seconds more than before)
        time.sleep(30 + 30)  # Added 30 more seconds as requested
        
        # Fade out music with ultra-smooth transition
        fade_duration = 60  # Increased to 60 seconds for extremely smooth fade
        fade_start_volume = track_player.audio_get_volume()
        steps = 500  # Significantly increased steps for ultra-smooth transition
        
        # Use a combination of easing functions for the most natural fade
        for i in range(steps + 1):
            # Cubic ease-out: f(i) = 1 - (1 - i/steps)^3
            # This creates a more natural-sounding fade that's very smooth
            progress = i / steps
            # Apply cubic easing for smoother curve
            volume = int(round(fade_start_volume * (1 - progress ** 3)))
            track_player.audio_set_volume(max(volume, 0))
            
            # Dynamic timing for natural fade perception
            # Faster changes at the beginning, slower at the end
            if i < steps * 0.6:  # First 60% of fade
                time.sleep(fade_duration / (steps * 1.5))  # Faster steps initially
            elif i < steps * 0.9:  # Next 30%
                time.sleep(fade_duration / (steps * 0.9))  # Medium speed
            else:  # Last 10%
                time.sleep(fade_duration / (steps * 0.7))  # Slowest at the very end
        
        # Gentle final fade and delay for clean stop
        for v in range(5, 0, -1):
            track_player.audio_set_volume(v)
            time.sleep(0.1)
        time.sleep(0.5)
        
        # Clean up
        track_player.stop()
        speech_player.stop()
        instance.release()
    
    # Start the fade out in a daemon thread (will be killed when main thread exits)
    fade_thread = threading.Thread(target=fade_out_music, daemon=True)
    fade_thread.start()
    
    # Return immediately, allowing the response to be sent to the client
    return

def play_audio_with_stereo_effect(speech_file_path: str, track_path: str) -> None:
    """
    Plays a track and speech audio with a stereo effect for speech (panned left/right
    with a slight delay), mixing the track at a lower volume with a smoother fade-out.

    Args:
    - speech_file_path (str): The path of the speech audio file to play.
    - track_path (str): The path of the track audio file to play.
    """

    # --- Get speech duration ---
    try:
        audio_metadata = MP3(speech_file_path)
        duration = audio_metadata.info.length
    except Exception as e:
        print(f"Error reading speech file metadata: {e}")
        return

    # --- Create VLC instance and players ---
    instance = vlc.Instance()
    speech_player_left = instance.media_player_new()
    speech_player_right = instance.media_player_new() # New player for right channel
    track_player = instance.media_player_new()

    # --- Create media objects ---
    speech_media = instance.media_new(speech_file_path)
    track_media = instance.media_new(track_path)

    # --- Set media to players ---
    speech_player_left.set_media(speech_media)
    speech_player_right.set_media(speech_media) # Use the same media for the right channel
    track_player.set_media(track_media)

    # --- Set initial volumes ---
    speech_player_left.audio_set_volume(50)
    speech_player_right.audio_set_volume(50) # Volume for the right channel speech
    track_player.audio_set_volume(50)

    # --- Set panning for speech players ---
    # VLC pan control: -1.0 is 100% Left, 1.0 is 100% Right, 0.0 is Center
    # audio_set_pan expects a float between -1.0 and 1.0
    try:
        speech_player_left.audio_set_pan(-1.0) # Pan left
        speech_player_right.audio_set_pan(1.0)  # Pan right
    except Exception as e:
         print(f"Warning: Could not set audio pan. Your VLC version may not support it. {e}")
         # Continue without panning if not supported


    # --- Start track playback ---
    track_player.play()
    time.sleep(0.1) # Give it a moment to start playing

    # Wait for track to start playing (handle potential buffering)
    start_time = time.time()
    while not track_player.is_playing() and time.time() - start_time < 5:  # Timeout after 5 seconds
        time.sleep(0.1)
    if not track_player.is_playing():
        print("Warning: Track failed to start playing.")
        # Consider adding cleanup here if track fails to play

    # --- Wait for a few seconds before starting speech (optional, based on your original code) ---
    time.sleep(8)

    # --- Start speech playback with a small delay ---
    speech_player_left.play()

    # Introduce the 3ms delay (0.003 seconds)
    time.sleep(0.006)

    speech_player_right.play()


    # --- Wait for speech players to start (handle potential buffering) ---
    start_time = time.time()
    # Wait until at least one speech player is playing or timeout
    while not (speech_player_left.is_playing() or speech_player_right.is_playing()) and time.time() - start_time < 5:
        time.sleep(0.1)
    if not (speech_player_left.is_playing() or speech_player_right.is_playing()):
         print("Warning: Neither speech player started playing.")
         # Consider adding cleanup here if speech fails to play

    # --- Wait for speech to finish ---
    # Wait for the duration of the speech, plus the delay, plus a small buffer.
    # We assume both players finish around the same time after their respective starts.
    time.sleep(duration + 0.003 + 1) # Add delay and buffer

    # --- Fade out music smoothly ---
    fade_duration = 10  # seconds
    fade_start_volume = track_player.audio_get_volume()
    steps = 100  # More steps for a smoother fade
    step_delay = fade_duration / steps

    for i in range(steps + 1):
        volume = int(round(fade_start_volume * (1 - i / steps)))
        track_player.audio_set_volume(max(volume, 0))
        time.sleep(step_delay)

    # --- Stop all players and release instance ---
    track_player.stop()
    speech_player_left.stop()
    speech_player_right.stop() # Stop the new speech player
    instance.release()

def play_audio_with_sync_ffmpeg(speech_file_path: str, track_path: str) -> None:
    """
    Plays a track and speech audio in sync using ffmpeg, mixing the track at a lower volume with a smoother fade-out.

    Args:
    - speech_file_path (str): The path of the speech audio file to play.
    - track_path (str): The path of the track audio file to play.
    """
    try:
        audio_metadata = MP3(speech_file_path)
        duration = audio_metadata.info.length
    except Exception as e:
        print(f"Error reading speech file metadata: {e}")
        return

    track_volume = 0.45  # Equivalent to VLC's 45/100
    fade_duration = 6  # seconds
    fade_steps = 100
    fade_interval = fade_duration / fade_steps

    track_process = None  # Initialize track_process
    speech_process = None # Initialize speech_process

    # Construct the initial ffmpeg command for background track
    base_command_track = [
        'ffplay',
        '-nodisp',  # No display window
        '-autoexit', # Exit when input ends
        '-volume', f'{int(track_volume * 100)}', # Volume as percentage
        track_path
    ]

    try:
        # Start playing the background track
        print("Starting background track...")
        track_process = subprocess.Popen(base_command_track)
        time.sleep(0.5) # Give it a moment to start

        print(f"Waiting for {8} seconds before starting speech...")
        time.sleep(8)

        # Construct the ffmpeg command for speech (playing simultaneously)
        speech_command = [
            'ffplay',
            '-nodisp',
            '-autoexit',
            speech_file_path
        ]

        print("Starting speech...")
        speech_process = subprocess.Popen(speech_command)

        print(f"Waiting for speech to finish (duration: {duration:.2f} seconds + buffer)...")
        time.sleep(duration + 1)

        print("Starting fade-out of background track...")
        for i in range(fade_steps + 1):
            current_volume = track_volume * (1 - i / fade_steps)
            volume_percent = max(0, int(current_volume * 100))
            # Need to send a command to the running ffplay process to change volume.
            # This is more complex with ffplay than with a dedicated library.
            # A simple way (though potentially less reliable and OS-dependent) is to kill and restart.
            if track_process and track_process.poll() is None:
                track_process.terminate()
                track_process.wait()
                new_track_command = base_command_track[:-1] + ['-volume', str(volume_percent), track_path]
                track_process = subprocess.Popen(new_track_command)
                time.sleep(fade_interval)
            else:
                break # Track might have already finished or been killed

        if track_process and track_process.poll() is None:
            print("Stopping background track.")
            track_process.terminate()
            track_process.wait()

        if speech_process and speech_process.poll() is None:
            print("Stopping speech.")
            speech_process.terminate()
            speech_process.wait()

        print("Playback finished.")

    except FileNotFoundError:
        print("Error: ffmpeg or ffplay not found. Make sure it's installed and in your system's PATH.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if track_process:
            track_process.kill()
            track_process.wait()
        if speech_process:
            speech_process.kill()
            speech_process.wait()

# Example usage (replace with your actual file paths):
# play_audio_with_sync_ffmpeg("path/to/your/speech.mp3", "path/to/your/track.mp3")

# Example usage (replace with your actual file paths):
# play_audio_with_sync_ffmpeg("path/to/your/speech.mp3", "path/to/your/track.mp3")
# Example usage (replace with your actual file paths):
# play_audio_with_sync("path/to/your/speech.mp3", "path/to/your/track.mp3")

# --- The 'Action' function - What happens when the speech finishes ---
# This little helper function gets called automatically when the event occurs.
# Its only job is to set our 'speech_finished_event' flag.



# --- Example of how to run it ---
# Make sure you have audio files named 'speech.mp3' and 'background_track.mp3'
# or change these names to your actual files/URLs.
# speech_file = "speech.mp3"
# track_file = "background_track.mp3"

# if os.path.exists(speech_file) and os.path.exists(track_file):
#      print("--- Starting Playback with Events ---")
#      play_audio_with_sync_events(speech_file, track_file)
#      print("--- Playback Function Returned ---")
# else:
#      print("Cannot find audio files. Please check paths.")
