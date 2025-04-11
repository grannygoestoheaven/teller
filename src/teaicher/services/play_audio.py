import os
import vlc
import time
import tempfile
import threading # We need this for our 'doorbell' (Event)
from mutagen.mp3 import MP3
# import mutagen.mp3 import MP3

# def play_audio_with_sync(speech_audio: bytes, track_url: str = None) -> tuple:
    # """
    # Plays a track and speech audio in sync, mixing the track at a lower volume.

    # Args:
    # - track_url (str): The URL of the track to play.
    # - speech_audio (bytes): The audio data for speech to play.
    # """
    # # Save speech audio to a temporary file
    # with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as speech_file:
    #     speech_file.write(speech_audio)
    #     speech_file_path = speech_file.name

    # speech_duration = MP3(speech_file_path).info.length
    
    # # Create VLC media players for the track and speech
    # track_player = vlc.MediaPlayer(track_url)
    # speech_player = vlc.MediaPlayer(speech_file_path)

    # # Set the track volume lower than speech
    # track_player.audio_set_volume(30)  # 0 to 100, lower value for quieter track
    # speech_player.audio_set_volume(100)  # 100 is normal volume for speech

    # # Start playing the track
    # track_player.play()

    # # Wait briefly before playing speech to sync audio
    # time.sleep(3)  # Adjust delay as needed for sync

    # # Start playing the speech
    # speech_player.play()
    
    # # Wait for the speech to finish and fade out the music
    # time.sleep(len(speech_duraton) + 3)  # Assuming speech_audio length is the duration of the speech

    # # Fade out music (simple volume control, fade out over 3 seconds)
    # for volume in range(100, -1, -1):
    #     player.audio_set_volume(volume)
    #     time.sleep(0.06)  # Adjust for the fade time

    # player.stop()
    # speech_player.stop()

    # return story, speech_file_path  # Return the story and path to speech audio

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

def play_audio_with_sync(speech_file_path: str, track_path: str) -> None:
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
    
    track_player = vlc.MediaPlayer(track_path)
    track_player.audio_set_volume(50)

    # time.sleep(duration + 2)  # ~32000 bytes/sec for mp3_22050_32
    
    track_player.play()
    while not track_player.is_playing(): # Here we are handling buffering of the track that may take a while
        time.sleep(0.1)

    time.sleep(6)

    speech_player.play()
    while not speech_player.is_playing(): # Here we are handling buffering also
        time.sleep(0.1)

    # Wait for speech to finish
    time.sleep(duration + 2)

    # Fade out music
    fade_duration = 6  # seconds
    step_delay = 0.02  # seconds
    steps = int(fade_duration / step_delay)  # = 300 steps

    for i in range(steps):
        volume = int(30 * (1 - i / steps))
        track_player.audio_set_volume(max(volume, 0))
        time.sleep(step_delay)

    track_player.stop()
    speech_player.stop()

    # return speech_audio, speech_file_path



# --- The 'Action' function - What happens when the speech finishes ---
# This little helper function gets called automatically when the event occurs.
# Its only job is to set our 'speech_finished_event' flag.

def speech_finished_callback(event, data):
    """Callback function triggered when the speech player finishes."""
    # print("--> Doorbell Rang! Speech player sent 'Finished' signal.")
    # 'data' here is the threading.Event object we pass when attaching
    speech_finished_event = data
    speech_finished_event.set() # Raise the flag!

def play_audio_with_sync_events(speech_file_path: str, track_path: str = None, track_url: str = None,) -> None:
    print(f"\n--- ENTERING play_audio_with_sync_events ---")
    print(f"FLASK CONTEXT DEBUG: Received speech_file_path: '{speech_file_path}'")
    print(f"FLASK CONTEXT DEBUG: Received track_path: '{track_path}'")
    print(f"FLASK CONTEXT DEBUG: Received track_url: '{track_url}'")
    """
    Plays track and speech using VLC events for synchronization.

    Args:
        speech_file_path (str): Path to the speech audio file.
        track_url (str): URL or path of the track audio file.

    - Instead of constantly asking "Is it done yet?", we set up a 'doorbell'.
    - VLC tells us *exactly* when the speech finishes (MediaPlayerEndReached event).
    - Our 'speech_finished_callback' function is the action taken when the doorbell rings.
    - The main script waits patiently using 'speech_finished_event.wait()' until notified.
    - This is more efficient, like waiting for a phone call instead of checking the phone every minute.
    

    """
    # --- The 'Doorbell Ringer' ---
    # Create an Event object. Think of it as a flag that's initially down.
    speech_finished_event = threading.Event()

    instance = None
    speech_player = None
    track_player = None
    event_manager = None

    try:
        # --- Setup ---
        print("Setting up the players...")
        instance = vlc.Instance('--no-xlib') # Helps run without a screen sometimes

        # Setup Speech Player
        speech_player = instance.media_player_new()
        speech_media = instance.media_new(speech_file_path)
        speech_player.set_media(speech_media)
        speech_player.audio_set_volume(100) # Speech nice and loud

        # --- Setting up the Listener for the Speech Player ---
        event_manager = speech_player.event_manager()

        # Tell the listener: "When the 'MediaPlayerEndReached' event happens,
        # call our 'speech_finished_callback' function, and give it
        # our 'speech_finished_event' flag so it can raise it."
        # We pass the event object itself as the second argument (user_data)
        event_manager.event_attach(
            vlc.EventType.MediaPlayerEndReached,
            speech_finished_callback,
            speech_finished_event # Pass our Event object to the callback
        )
        print("Listener attached to speech player for 'Finished' signal.")

        # Setup Track Player
        track_player = instance.media_player_new()
        print(f"FLASK DEBUG: Final track source path being passed: '{actual_track_source}'")
        track_media = instance.media_new(track_url)
        track_player.set_media(track_media)
        track_player.audio_set_volume(30) # Background track quieter

        # --- Start Playback and Synchronization ---
        print("Starting track...")
        track_player.play()
        time.sleep(0.5) # Give it a moment to start
        if track_player.get_state() == vlc.State.Error:
            print(f"Oops! Couldn't play the track: {track_url}")
            return

        print("Waiting 3 seconds before starting speech...")
        time.sleep(3) # Fixed delay

        print("Starting speech...")
        speech_player.play()
        time.sleep(0.5) # Give it a moment
        if speech_player.get_state() == vlc.State.Error:
            print(f"Oops! Couldn't play the speech: {speech_file_path}")
            if track_player and track_player.is_playing(): track_player.stop()
            return

        # --- Wait Patiently using the Event ---
        print("Waiting for the speech to finish (listening for the 'doorbell')...")
        # This line will pause the script right here. It does nothing until
        # speech_finished_callback calls speech_finished_event.set()
        speech_finished_event.wait() # Wait for the flag to be raised

        print("Speech finished signal received!")

        # --- Post-Speech Actions ---
        print("Waiting 3 seconds post-speech...")
        time.sleep(3) # Fixed delay after speech

        print("Fading out track...")
        initial_volume = track_player.audio_get_volume()
        if initial_volume <= 0: initial_volume = 30
        fade_duration = 6
        step_delay = 0.05
        steps = int(fade_duration / step_delay)

        if steps > 0:
            for i in range(steps + 1):
                volume = int(initial_volume * (1 - (i / steps)))
                if volume < 0: volume = 0
                track_player.audio_set_volume(volume)
                time.sleep(step_delay)
        else:
            track_player.audio_set_volume(0)

        print("Stopping players.")
        if track_player and track_player.is_playing(): track_player.stop()
        # Speech player is already stopped/ended, but stopping again is harmless
        if speech_player: speech_player.stop()

    except Exception as e:
        print(f"Something went wrong during playback: {e}")
        # Make sure things are stopped if an error happens
        if track_player and track_player.is_playing(): track_player.stop()
        if speech_player and speech_player.is_playing(): speech_player.stop()

    finally:
        # --- Cleanup - Very important! ---
        print("Cleaning up...")
        # Detach the listener first
        if event_manager and speech_finished_event.is_set(): # Only detach if attached
             try:
                 # Check if callback is still attached before detaching
                 # Note: python-vlc doesn't have a direct 'is_attached' check easily available,
                 # so we rely on having attached it earlier in the try block.
                 # Detaching multiple times might be harmless or might error depending on version/bindings.
                 # We'll assume detaching is safe.
                 event_manager.event_detach(vlc.EventType.MediaPlayerEndReached)
                 print("Listener detached.")
             except Exception as detach_error:
                 print(f"Minor issue during event detach (might be harmless): {detach_error}")


        # Release the players (like turning off the DVD player)
        if speech_player:
            speech_player.release()
            print("Speech player released.")
        if track_player:
            track_player.release()
            print("Track player released.")
        # Release the main VLC instance (like shutting down the whole system)
        if instance:
            instance.release()
            print("VLC instance released.")
        print("Playback finished and resources cleaned up. All done!")

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

# def play_audio_with_sync_events(speech_file_path: str, track_path: str = None, track_url: str = None) -> None:
    """
    Plays track and speech using VLC events for synchronization.
    Prioritizes track_url if both are provided.
    """
    speech_finished_event = threading.Event()
    instance = None
    speech_player = None
    track_player = None
    event_manager = None

    # --- Determine the Track Source ---
    actual_track_source = None
    
    if track_url:
        actual_track_source = track_url
        print(f"Using track source (URL): {actual_track_source}")
    elif track_path:
        # Optional: Add an extra check here if needed, though Flask route should check existence
        # if os.path.exists(track_path):
        actual_track_source = track_path
        print(f"Using track source (Path): {actual_track_source}")
        # else:
        #      print(f"Track path provided but not found: {track_path}. Proceeding without track.")
        #      # Fall through to potentially playing speech only if track player setup fails
    else:
        print("No track source (URL or Path) provided.")
        # Decide how to handle this - maybe error out, or proceed with speech only

    try:
        # --- Setup ---
        print("Setting up the players...")
        instance = vlc.Instance('--no-xlib')

        # Setup Speech Player (remains the same)
        speech_player = instance.media_player_new()
        # Check if speech_file_path is valid before creating media
        if not speech_file_path or not os.path.exists(speech_file_path):
             print(f"Error: Invalid speech file path: {speech_file_path}")
             return # Exit if speech path is bad
        speech_media = instance.media_new(speech_file_path)
        speech_player.set_media(speech_media)
        speech_player.audio_set_volume(100)

        # Setup Event Manager (remains the same)
        event_manager = speech_player.event_manager()
        event_manager.event_attach(
            vlc.EventType.MediaPlayerEndReached,
            speech_finished_callback,
            speech_finished_event
        )
        print("Listener attached to speech player.")

        # --- Setup Track Player using the CORRECT source ---
        if actual_track_source:
            track_player = instance.media_player_new()
            track_media = instance.media_new(actual_track_source) # Use the determined source
            track_player.set_media(track_media)
            track_player.audio_set_volume(30)
            print("Track player setup with source.")
        else:
            print("Skipping track player setup as no valid source was found.")
            track_player = None # Ensure track_player is None if not set up

        # --- Start Playback and Synchronization ---
        if track_player: # Only play track if it was set up correctly
            print("Starting track...")
            track_player.play()
            time.sleep(0.5)
            track_state = track_player.get_state()
            if track_state == vlc.State.Error:
                print(f"Oops! Couldn't play the track: {actual_track_source}. State: {track_state}")
                # Decide if you want to stop everything or continue with speech only
                track_player.stop()
                track_player = None # Treat as if no track was provided from now on
            elif track_state == vlc.State.Ended:
                print(f"Warning: Track seems to have ended immediately (maybe very short?): {actual_track_source}")
                # Continue, but fadeout might be weird.

        # Start speech only if speech player is valid
        if speech_player and speech_player.get_media():
            print("Waiting 3 seconds before starting speech...")
            time.sleep(3)
            print("Starting speech...")
            speech_player.play()
            time.sleep(0.5)
            speech_state = speech_player.get_state()
            if speech_state == vlc.State.Error:
                print(f"Oops! Couldn't play the speech: {speech_file_path}. State: {speech_state}")
                if track_player and track_player.is_playing(): track_player.stop()
                # Maybe return an error to the UI? For now, just stops.
                return # Exit if speech fails

            # --- Wait Patiently using the Event ---
            print("Waiting for the speech to finish...")
            speech_finished_event.wait()
            print("Speech finished signal received!")

        else:
             print("Error: Cannot play speech, player not ready or invalid path.")
             if track_player and track_player.is_playing(): track_player.stop()
             return # Exit if speech can't be played


        # --- Post-Speech Actions ---
        if track_player: # Only do post-speech actions if track exists
            print("Waiting 3 seconds post-speech...")
            time.sleep(3)

            print("Fading out track...")
            initial_volume = track_player.audio_get_volume()
            # Check if player is still valid before getting volume
            if initial_volume is None or initial_volume < 0: initial_volume = 30 # Default if error getting volume

            fade_duration = 6
            step_delay = 0.05
            steps = int(fade_duration / step_delay)

            if steps > 0 and track_player.is_playing(): # Check if playing before fading
                for i in range(steps + 1):
                    volume = int(initial_volume * (1 - (i / steps)))
                    if volume < 0: volume = 0
                    track_player.audio_set_volume(volume)
                    time.sleep(step_delay)
            elif track_player: # Ensure player exists before setting volume to 0
                track_player.audio_set_volume(0)

            print("Stopping track player.")
            track_player.stop()
        else:
             print("No track player active, skipping post-speech delay and fade.")


        # Speech player should be stopped/ended already via event, but ensure state
        if speech_player:
             # Optional: Check state before stopping if needed
             # current_speech_state = speech_player.get_state()
             # if current_speech_state not in [vlc.State.Ended, vlc.State.Stopped, vlc.State.Error]:
             #      speech_player.stop()
             pass # Already stopped naturally or handled by error


    except Exception as e:
        print(f"Something went wrong during playback: {e}")
        if track_player and track_player.is_playing(): track_player.stop()
        if speech_player and speech_player.is_playing(): speech_player.stop()

    finally:
        # --- Cleanup ---
        print("Cleaning up...")
        if event_manager: # Check if event_manager was created
             try:
                 # Detach might fail if player was released early or event never fired correctly
                 event_manager.event_detach(vlc.EventType.MediaPlayerEndReached)
                 print("Listener detached.")
             except Exception as detach_error:
                 print(f"Minor issue during event detach (might be harmless): {detach_error}")

        if speech_player:
            speech_player.release()
            print("Speech player released.")
        if track_player:
            track_player.release()
            print("Track player released.")
        if instance:
            instance.release()
            print("VLC instance released.")
        print("Playback cleanup finished.")