# Class to manage ambient track playback state
class AmbientTrackManager:
    _instance = None
    _tracks = []
    _played_tracks = []
    _initialized = False
    
    @classmethod
    def initialize(cls, base_dir):
        if not cls._initialized:
            ambient_dir = os.path.join(base_dir, 'static', 'audio', LOCAL_AMBIENT_TRACKS_DIR)
            try:
                cls._tracks = [f for f in os.listdir(ambient_dir) 
                            if f.endswith(('.mp3', '.wav', '.flac'))]
                random.shuffle(cls._tracks)  # Initial shuffle for more randomness
                cls._initialized = True
            except FileNotFoundError:
                app.logger.warning(f"Ambient tracks directory not found: {ambient_dir}")
                cls._tracks = [] # Ensure it's empty if dir not found
                cls._initialized = True # Mark as initialized to prevent repeated warnings
    
    @classmethod
    def get_next_track(cls, base_dir, logger):
        if not cls._initialized:
            cls.initialize(base_dir)
            
        ambient_dir = os.path.join(base_dir, 'static', 'audio', LOCAL_AMBIENT_TRACKS_DIR)
        
        if not cls._tracks and not cls._played_tracks:
            logger.warning(f"No MP3 or WAV files found in {ambient_dir}. No ambient sound will be played.")
            return None
            
        # If we've played all tracks, refresh the list
        if not cls._tracks:
            cls._tracks = cls._played_tracks
            cls._played_tracks = []
            random.shuffle(cls._tracks)  # Reshuffle before starting over
            
        # Get next track and move it to played
        track_filename = cls._tracks.pop(0)
        # We store the relative path for the client
        relative_track_path = os.path.join('audio', LOCAL_AMBIENT_TRACKS_DIR, track_filename)
        cls._played_tracks.append(track_filename) # Store original filename for internal management
        
        return relative_track_path

def _get_local_track_url(base_dir, logger):
    """
    Retrieves the URL for the next local ambient track.
    This URL is relative to the static folder, suitable for url_for.
    """
    try:
        track_relative_static_path = AmbientTrackManager.get_next_track(base_dir, logger)
        if track_relative_static_path:
            return url_for('static', filename=track_relative_static_path)
        return None
    except Exception as e:
        logger.error(f"Error getting ambient track URL: {str(e)}")
        return None
