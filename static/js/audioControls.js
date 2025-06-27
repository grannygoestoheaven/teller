// Assume speechAudio and backgroundAudio are passed or globally accessible (or get them inside functions)
// For better modularity, you could pass these elements as arguments or get them within the functions
// Here, we'll pass them to the functions that need them.

let speechAudio;
let backgroundAudio;
let period2; // For the play/pause icon

// Store timeout/interval IDs for clearing
export let bgFadeInIntervalId = null;
export let bgFadeOutIntervalId = null;
export let speechDelayTimeoutId = null;
export let speechAudioOnEndedTimeoutId = null; // Renamed for clarity

export function initAudioElements(speechEl, backgroundEl, period2El) {
    speechAudio = speechEl;
    backgroundAudio = backgroundEl;
    period2 = period2El;
}

// --- Audio Control Functions ---
export function restartSpeech() {
    // Clear any ongoing intervals/timeouts from previous audio states
    if (bgFadeInIntervalId) clearInterval(bgFadeInIntervalId);
    if (bgFadeOutIntervalId) clearInterval(bgFadeOutIntervalId);
    if (speechDelayTimeoutId) clearTimeout(speechDelayTimeoutId);
    if (speechAudioOnEndedTimeoutId) clearTimeout(speechAudioOnEndedTimeoutId);

    // Ensure background audio volume is reset and playing
    if (backgroundAudio.src) { // Only try to play if a source is set
        backgroundAudio.volume = 0.3; // Set to target background volume
        backgroundAudio.currentTime = 0;
        backgroundAudio.play().catch(e => console.error("Background audio restart failed:", e));
    }

    // Restart speech audio
    if (speechAudio.src) { // Only try to play if a source is set
        speechAudio.currentTime = 0;
        speechAudio.play().catch(e => console.error("Speech audio restart failed:", e));
    }
    updatePlayPauseIcon();
}

export function togglePlayPauseSpeech() {
    if (speechAudio.paused) {
        if (speechAudio.src) {
            speechAudio.play().catch(e => console.error("Speech audio play failed:", e));
        }
        // Ensure background audio is also playing if speech starts
        if (backgroundAudio.paused && backgroundAudio.src) {
            backgroundAudio.play().catch(e => console.error("Background audio play failed:", e));
        }
    } else {
        speechAudio.pause();
        // For 'Knowledge Drifting', leaving background music playing might be preferred when speech is paused.
        // backgroundAudio.pause(); // Uncomment to pause background with speech
    }
    updatePlayPauseIcon();
}

export function updatePlayPauseIcon() {
    if (period2) {
        period2.textContent = speechAudio.paused ? '▶' : '⏸';
        period2.classList.toggle('control-play', speechAudio.paused);
        period2.classList.toggle('control-pause', !speechAudio.paused);
    }
}

// This function will be called from main.js when audio starts playing
export function handleAudioPlayback(data) {
    if (data.has_audio && data.audio_url) {
        speechAudio.src = data.audio_url;
        speechAudio.volume = 1.0; // Set speech volume to 100%

        if (data.track_url) {
            backgroundAudio.src = data.track_url;
            backgroundAudio.volume = 0; // Start muted for fade-in
            backgroundAudio.play().catch(e => console.error("Background audio playback failed:", e));

            const maxVolume = 0.3; // Define your max volume here
            let bgVolume = 0;
            bgFadeInIntervalId = setInterval(() => {
                if (bgVolume < maxVolume) {
                    bgVolume += 0.005; // Small step for smooth fade
                    backgroundAudio.volume = bgVolume;
                } else {
                    clearInterval(bgFadeInIntervalId);
                }
            }, 50);

            // Delay speech playback
            speechDelayTimeoutId = setTimeout(() => {
                speechAudio.play().catch(e => console.error("Speech audio playback failed:", e));
                updatePlayPauseIcon();
            }, 8000); // 8-second delay before speech starts

            speechAudio.onended = () => {
                // Clear the previous speech ended timeout if a new one is set
                if (speechAudioOnEndedTimeoutId) clearTimeout(speechAudioOnEndedTimeoutId);

                speechAudioOnEndedTimeoutId = setTimeout(() => { // Store this timeout ID
                    let fadeOutVolume = backgroundAudio.volume;
                    bgFadeOutIntervalId = setInterval(() => { // Store this interval ID
                        if (fadeOutVolume > 0) {
                            fadeOutVolume -= 0.0005; // Even smaller step for ultra-smooth 45s fade
                            backgroundAudio.volume = Math.max(0, fadeOutVolume);
                        } else {
                            clearInterval(bgFadeOutIntervalId);
                            backgroundAudio.pause();
                            backgroundAudio.currentTime = 0; // Reset for next time
                        }
                    }, 50);
                }, 45000); // 45 seconds ambient after speech
            };
        } else {
            // No background track, just play speech directly
            speechAudio.play().catch(e => console.error("Speech audio playback failed:", e));
            speechAudio.onended = () => {
                // Ensure background is off if no track was loaded
                backgroundAudio.pause();
                backgroundAudio.currentTime = 0;
            };
        }
    } else {
        console.warn('No audio link provided for the story.');
    }
}