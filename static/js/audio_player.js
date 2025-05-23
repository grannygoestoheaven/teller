// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    const audioElement = document.getElementById('story-audio');
    const playPauseButton = document.getElementById('play-pause-button');
    const startOverButton = document.getElementById('start-over-button');
    const replay10sButton = document.getElementById('replay-10s-button');
    const storyTitleElement = document.getElementById('story-title-display'); // Assuming you have an element to display the title

    // Sound effect for play button
    const penClickSound = new Audio('/static/audio/sfx/pen_click.m4v'); 
    // Preload the sound effect for faster playback
    penClickSound.preload = 'auto'; 

    if (!audioElement || !playPauseButton || !startOverButton || !replay10sButton) {
        console.error('Audio player controls not found in the DOM. Ensure elements with IDs story-audio, play-pause-button, start-over-button, and replay-10s-button exist.');
        return;
    }

    // Function to load and play a new track
    window.loadAndPlayTrack = function(audioUrl, storyTitle) {
        if (storyTitleElement) {
            storyTitleElement.textContent = storyTitle || 'Playing Audio';
        }
        audioElement.src = audioUrl;
        audioElement.load(); // Important to load the new source
        
        // Attempt to play, but be mindful of autoplay policies
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Autoplay started!
                playPauseButton.textContent = 'Pause';
            }).catch(error => {
                // Autoplay was prevented.
                console.warn('Autoplay prevented. User interaction may be required to start audio:', error);
                playPauseButton.textContent = 'Play'; // Set to Play so user can initiate
            });
        }
    };

    // Play/Pause button functionality
    playPauseButton.addEventListener('click', () => {
        if (audioElement.src && (audioElement.paused || audioElement.ended)) {
            // Play the pen click sound first
            penClickSound.currentTime = 0; // Rewind to start if played before
            penClickSound.play().catch(e => console.error('Error playing pen click sound:', e));
            
            // Then play the main audio
            audioElement.play().then(() => {
                playPauseButton.textContent = 'Pause';
            }).catch(e => console.error('Error playing main audio:', e));
        } else if (audioElement.src) {
            audioElement.pause();
            playPauseButton.textContent = 'Play';
        } else {
            console.warn('No audio source loaded to play/pause.');
        }
    });

    // Start Over button functionality
    startOverButton.addEventListener('click', () => {
        if (audioElement.src) {
            audioElement.currentTime = 0;
            // Play the pen click sound first
            penClickSound.currentTime = 0;
            penClickSound.play().catch(e => console.error('Error playing pen click sound:', e));
            
            audioElement.play().then(() => {
                playPauseButton.textContent = 'Pause';
            }).catch(e => console.error('Error playing main audio:', e));
        } else {
            console.warn('No audio source loaded to start over.');
        }
    });

    // Replay 10s button functionality
    replay10sButton.addEventListener('click', () => {
        if (audioElement.src) {
            audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
            // Optionally play if paused and user expects replay to also start playback
            if (audioElement.paused && audioElement.currentTime > 0) { 
                penClickSound.currentTime = 0;
                penClickSound.play().catch(e => console.error('Error playing pen click sound:', e));
                audioElement.play().then(() => {
                    playPauseButton.textContent = 'Pause';
                }).catch(e => console.error('Error playing main audio:', e));
            }
        } else {
            console.warn('No audio source loaded to replay.');
        }
    });

    // Update button text based on audio element events
    audioElement.addEventListener('play', () => {
        if (audioElement.src) playPauseButton.textContent = 'Pause';
    });

    audioElement.addEventListener('pause', () => {
        if (audioElement.src) playPauseButton.textContent = 'Play';
    });

    audioElement.addEventListener('ended', () => {
        if (audioElement.src) playPauseButton.textContent = 'Play'; // Or 'Replay'
    });

    console.log('Audio player initialized. Ensure your HTML includes an <audio id="story-audio"></audio> tag and buttons with IDs: play-pause-button, start-over-button, replay-10s-button, and optionally story-title-display.');
});
