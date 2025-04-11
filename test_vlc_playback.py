# test_vlc_playback.py
import vlc
import time
import os
import sys

# --- CONFIGURATION ---
# IMPORTANT: Replace this with the actual path to your track file!
# Use '~' for your home directory, or provide the full absolute path.
# Make sure forward slashes '/' are used, even on Windows.
# Example using tilde:
track_file_path_raw = "src/static/audio/Leaf_Bed.mp3"
# Example full path (macOS/Linux):
# track_file_path_raw = "/Users/your_username/code/computer_science_projects/teaicher/src/static/audio/Leaf_Bed.mp3"
# Example full path (Windows):
# track_file_path_raw = "C:/Users/your_username/code/computer_science_projects/teaicher/src/static/audio/Leaf_Bed.mp3"

# --- SCRIPT ---

print("--- VLC Simple Playback Test ---")

# 1. Expand the user path (resolves '~')
track_file_path_absolute = os.path.expanduser(track_file_path_raw)
print(f"Attempting to play file: {track_file_path_absolute}")

# 2. Check if the file exists
if not os.path.exists(track_file_path_absolute):
    print(f"ERROR: File not found at the specified path: {track_file_path_absolute}")
    print("Please double-check the 'track_file_path_raw' variable in the script.")
    sys.exit(1) # Exit the script if file not found

# Initialize VLC instance, player, and media variables
instance = None
player = None
media = None

try:
    # 3. Create VLC instance
    # '--no-xlib' is often helpful when running without a full desktop environment
    instance = vlc.Instance('--no-xlib --quiet') # '--quiet' reduces VLC's own console output
    if not instance:
        print("ERROR: Could not create VLC instance. Is VLC installed correctly?")
        sys.exit(1)
    print("VLC Instance created.")

    # 4. Create a Media Player object
    player = instance.media_player_new()
    if not player:
        print("ERROR: Could not create VLC media player.")
        sys.exit(1)
    print("Media Player created.")

    # 5. Create a Media object from the file path
    media = instance.media_new(track_file_path_absolute)
    if not media:
        print(f"ERROR: Could not create media object for path: {track_file_path_absolute}")
        sys.exit(1)
    print(f"Media object created for: {media.get_mrl()}") # MRL is like VLC's internal path/URL

    # Optional: Parse media info asynchronously (helps get duration faster sometimes)
    # media.parse_async()
    # time.sleep(1) # Give it a moment to parse

    # 6. Set the media for the player
    player.set_media(media)
    print("Media set on player.")

    # 7. Start playback
    play_result = player.play() # play() returns 0 on success, -1 on error
    if play_result == -1:
        print("ERROR: player.play() returned an error code. Cannot start playback.")
        sys.exit(1)

    print("Playback started (or attempted)...")
    # Give VLC a moment to actually start playing
    time.sleep(1)

    # 8. Monitor playback state
    playback_duration = 0
    max_wait_time = 30 # Maximum seconds to wait in this test
    start_time = time.time()

    while time.time() - start_time < max_wait_time:
        current_state = player.get_state()
        print(f"Current player state: {current_state}")

        if current_state == vlc.State.Playing:
            # Get media duration once available
            if playback_duration == 0:
                 duration_ms = player.get_length() # Duration in milliseconds
                 if duration_ms > 0:
                      playback_duration = duration_ms / 1000.0
                      print(f"Media duration: {playback_duration:.2f} seconds")
            # Keep checking state
            time.sleep(0.5)
            continue

        elif current_state == vlc.State.Ended:
            print("Playback finished normally.")
            break # Exit the loop

        elif current_state == vlc.State.Error:
            print("ERROR: Player entered Error state. Playback failed.")
            break # Exit the loop

        elif current_state in [vlc.State.Stopped, vlc.State.NothingSpecial, vlc.State.Opening, vlc.State.Buffering]:
            # Still waiting or stopped prematurely
            print("Waiting or intermediate state...")
            time.sleep(0.5)
            # Optional: Check if media is valid if stuck here long
            # if time.time() - start_time > 5 and player.get_media() is None:
            #    print("ERROR: Media seems to have become invalid.")
            #    break
        else:
            # Other states (Paused, etc.) - unlikely in this script
            print(f"Unhandled state: {current_state}")
            time.sleep(0.5)

    else: # This else clause executes if the while loop completes without a 'break'
        print(f"WARN: Playback did not finish or error out within {max_wait_time} seconds. Stopping manually.")

except Exception as e:
    print(f"\n--- An unexpected Python error occurred ---")
    print(f"Error type: {type(e).__name__}")
    print(f"Error details: {e}")

finally:
    # 9. Cleanup - always release resources
    print("\n--- Cleaning up VLC resources ---")
    if player:
        if player.is_playing():
            print("Stopping player...")
            player.stop()
        print("Releasing player...")
        player.release()
    # Media object is implicitly managed by instance/player usually,
    # but releasing instance handles it.
    if instance:
        print("Releasing instance...")
        instance.release()
    print("--- Test Finished ---")