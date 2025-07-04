let speechAudio;
let backgroundAudio;

// Internal variables to store timeout/interval IDs
let bgFadeInIntervalId = null;
let bgFadeOutIntervalId = null;
let speechDelayTimeoutId = null;
let speechAudioOnEndedTimeoutId = null;

export function initAudioElements(speechEl, backgroundEl) {
    speechAudio = speechEl;
    backgroundAudio = backgroundEl;
}

// --- New functions to clear intervals/timeouts ---
export function clearAllAudioTimeouts() {
    if (bgFadeInIntervalId) {
        clearInterval(bgFadeInIntervalId);
        bgFadeInIntervalId = null; // Clear reference
    }
    if (bgFadeOutIntervalId) {
        clearInterval(bgFadeOutIntervalId);
        bgFadeOutIntervalId = null; // Clear reference
    }
    if (speechDelayTimeoutId) {
        clearTimeout(speechDelayTimeoutId);
        speechDelayTimeoutId = null; // Clear reference
    }
    if (speechAudioOnEndedTimeoutId) {
        clearTimeout(speechAudioOnEndedTimeoutId);
        speechAudioOnEndedTimeoutId = null; // Clear reference
    }
}

export function restartSpeech() {
    clearAllAudioTimeouts(); // Clear everything before restarting

    // Ensure background audio volume is reset and playing
    if (backgroundAudio.src) { // Only try to play if a source is set
        backgroundAudio.volume = 0.3; // Set to 30% volume for background
        backgroundAudio.currentTime = 0;
        console.log(`Restarting speech. Setting background volume to: ${backgroundAudio.volume}`);
    }

    // Restart speech audio
    if (speechAudio.src) { // Only try to play if a source is set
        speechAudio.currentTime = 0;
        speechAudio.play().catch(e => console.error("Speech audio restart failed:", e));
    }
    // updatePlayPauseIcon(); // Not used/implemented, can be removed if not needed elsewhere
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
        // backgroundAudio.pause(); // Uncomment to pause background with speech
    }
    // updatePlayPauseIcon(); // Not used/implemented
}

export function updatePlayPauseIcon() {
    // This function is kept for API compatibility but does nothing currently.
}

export function handleAudioPlayback(data) {
    // Clear any existing audio operations before starting new ones
    clearAllAudioTimeouts();

    if (data.has_audio && data.audio_url) {
        speechAudio.src = data.audio_url;
        speechAudio.volume = 1.0; // Set speech volume to 100%

        if (data.track_url) {
            backgroundAudio.src = data.track_url;
            backgroundAudio.volume = 0; // Start muted for fade-in
            
            const maxVolume = 0.3; // Max volume set to 30% for background
            const fadeInDuration = 10000; // 10 seconds
            const intervalMs = 50;
            const steps = fadeInDuration / intervalMs;
            const volumeIncreasePerStep = maxVolume / steps;
            let bgVolume = 0; // This will track the target volume for each step
            
            bgFadeInIntervalId = setInterval(() => {
                bgVolume += volumeIncreasePerStep;
                if (bgVolume >= maxVolume) {
                    backgroundAudio.volume = maxVolume; // Set to final volume
                    console.log(`Background audio fade-in complete. Final volume: ${backgroundAudio.volume}`);
                    clearInterval(bgFadeInIntervalId);
                    bgFadeInIntervalId = null;
                    
                    // Wait 5 seconds, then play speech
                    speechDelayTimeoutId = setTimeout(() => {
                        speechAudio.play().catch(e => {
                            console.error("Speech audio playback failed:", e);
                            const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
                            document.dispatchEvent(event);
                        });
                    }, 5000); // 5-second delay
                } else {
                    backgroundAudio.volume = bgVolume;
                    console.log(`Fading in background audio. Current volume: ${backgroundAudio.volume}`);
                }
            }, intervalMs);
            backgroundAudio.play().catch(e => console.error("Background audio playback failed:", e));
            
            // Function to handle speech end and cleanup
            speechAudio.onended = () => {
                // Dispatch event to show story text immediately
                const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
                document.dispatchEvent(event);

                // Wait for 40 seconds, then fade out
                speechAudioOnEndedTimeoutId = setTimeout(() => {
                    let fadeOutVolume = backgroundAudio.volume;
                    const fadeOutDuration = 35000;
                    const fadeOutSteps = fadeOutDuration / intervalMs;
                    const volDecrement = fadeOutVolume / fadeOutSteps;

                    bgFadeOutIntervalId = setInterval(() => {
                        fadeOutVolume -= volDecrement;
                        if (fadeOutVolume <= 0) {
                            backgroundAudio.volume = 0;
                            clearInterval(bgFadeOutIntervalId);
                            bgFadeOutIntervalId = null;
                            backgroundAudio.pause();
                            backgroundAudio.currentTime = 0;
                        } else {
                            backgroundAudio.volume = fadeOutVolume;
                        }
                    }, intervalMs);
                }, 40000); // 40-second ambient period
            };
        } else { // No background track
            // Just play speech directly
            speechAudio.play().catch(e => {
                console.error("Speech audio playback failed:", e);
                // Dispatch speechEnded even if playback fails
                const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
                document.dispatchEvent(event);
            });
            speechAudio.onended = () => {
                clearAllAudioTimeouts(); // Clear relevant timeouts
                // Ensure background is off if no track was loaded
                backgroundAudio.pause();
                backgroundAudio.currentTime = 0;
                // --- Also dispatch speechEnded if no background audio was involved ---
                const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
                document.dispatchEvent(event);
            };
        }
    } else { // No audio link provided at all
        console.warn('No audio link provided for the story.');
        // If no audio, still signal that 'speech' (or content readiness) is done
        const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
        document.dispatchEvent(event);
    }
}
