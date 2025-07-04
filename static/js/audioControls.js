// // Assume speechAudio and backgroundAudio are passed or globally accessible (or get them inside functions)
// // For better modularity, you could pass these elements as arguments or get them within the functions
// // Here, we'll pass them to the functions that need them.

// let speechAudio;
// let backgroundAudio;
// let period2; // For the play/pause icon

// // Store timeout/interval IDs for clearing
// export let bgFadeInIntervalId = null;
// export let bgFadeOutIntervalId = null;
// export let speechDelayTimeoutId = null;
// export let speechAudioOnEndedTimeoutId = null; // Renamed for clarity

// export function initAudioElements(speechEl, backgroundEl) {
//     speechAudio = speechEl;
//     backgroundAudio = backgroundEl;
//     // Don't store period2 reference as we're not using it anymore
// }

// // --- Audio Control Functions ---
// export function restartSpeech() {
//     // Clear any ongoing intervals/timeouts from previous audio states
//     if (bgFadeInIntervalId) clearInterval(bgFadeInIntervalId);
//     if (bgFadeOutIntervalId) clearInterval(bgFadeOutIntervalId);
//     if (speechDelayTimeoutId) clearTimeout(speechDelayTimeoutId);
//     if (speechAudioOnEndedTimeoutId) clearTimeout(speechAudioOnEndedTimeoutId);

//     // Ensure background audio volume is reset and playing
//     if (backgroundAudio.src) { // Only try to play if a source is set
//         backgroundAudio.volume = 0.3; // Set to 30% volume for background
//         backgroundAudio.currentTime = 0;
//         backgroundAudio.play().catch(e => console.error("Background audio restart failed:", e));
//     }

//     // Restart speech audio
//     if (speechAudio.src) { // Only try to play if a source is set
//         speechAudio.currentTime = 0;
//         speechAudio.play().catch(e => console.error("Speech audio restart failed:", e));
//     }
//     updatePlayPauseIcon();
// }

// export function togglePlayPauseSpeech() {
//     if (speechAudio.paused) {
//         if (speechAudio.src) {
//             speechAudio.play().catch(e => console.error("Speech audio play failed:", e));
//         }
//         // Ensure background audio is also playing if speech starts
//         if (backgroundAudio.paused && backgroundAudio.src) {
//             backgroundAudio.play().catch(e => console.error("Background audio play failed:", e));
//         }
//     } else {
//         speechAudio.pause();
//         // For 'Knowledge Drifting', leaving background music playing might be preferred when speech is paused.
//         // backgroundAudio.pause(); // Uncomment to pause background with speech
//     }
//     updatePlayPauseIcon();
// }

// export function updatePlayPauseIcon() {
//     // Do nothing to prevent modifying the second dot
//     // This function is kept for API compatibility
// }

// // This function will be called from main.js when audio starts playing
// export function handleAudioPlayback(data) {
//     if (data.has_audio && data.audio_url) {
//         speechAudio.src = data.audio_url;
//         speechAudio.volume = 1.0; // Set speech volume to 100%

//         if (data.track_url) {
//             backgroundAudio.src = data.track_url;
//             backgroundAudio.volume = 0; // Start muted for fade-in
//             backgroundAudio.play().catch(e => console.error("Background audio playback failed:", e));

//             const maxVolume = 0.3; // Max volume set to 30% for background
//             let bgVolume = 0;
//             bgFadeInIntervalId = setInterval(() => {
//                 if (bgVolume < maxVolume) {
//                     bgVolume += 0.005; // Small step for smooth fade
//                     backgroundAudio.volume = bgVolume;
//                 } else {
//                     clearInterval(bgFadeInIntervalId);
//                 }
//             }, 50);

//             // Delay speech playback
//             speechDelayTimeoutId = setTimeout(() => {
//                 speechAudio.play().catch(e => console.error("Speech audio playback failed:", e));
//                 updatePlayPauseIcon();
//             }, 8000); // 8-second delay before speech starts

//             // Function to handle speech end and cleanup
//             const onSpeechEnded = () => {
//                 // Clear any existing timeouts/intervals
//                 if (speechAudioOnEndedTimeoutId) clearTimeout(speechAudioOnEndedTimeoutId);
                
//                 // Trigger the speechEnded event immediately when speech ends
//                 const event = new CustomEvent('speechEnded');
//                 document.dispatchEvent(event);
                
//                 // Start background fade out after speech ends (but keep playing)
//                 let fadeOutVolume = backgroundAudio.volume;
//                 bgFadeOutIntervalId = setInterval(() => {
//                     if (fadeOutVolume > 0) {
//                         fadeOutVolume -= 0.0005; // Smooth fade out
//                         backgroundAudio.volume = Math.max(0, fadeOutVolume);
                        
//                         if (fadeOutVolume <= 0) {
//                             clearInterval(bgFadeOutIntervalId);
//                             backgroundAudio.pause();
//                             backgroundAudio.currentTime = 0; // Reset for next time
//                         }
//                     }
//                 }, 50);
//             };
            
//             speechAudio.onended = () => {
//                 // Clear the previous speech ended timeout if a new one is set
//                 if (speechAudioOnEndedTimeoutId) clearTimeout(speechAudioOnEndedTimeoutId);

//                 // Function to handle speech end and cleanup
//                 const onSpeechEnded = () => {
//                     // Clear any existing timeouts/intervals
//                     if (speechAudioOnEndedTimeoutId) clearTimeout(speechAudioOnEndedTimeoutId);
                    
//                     // Trigger the speechEnded event immediately when speech ends
//                     const event = new CustomEvent('speechEnded');
//                     document.dispatchEvent(event);
                    
//                     // Start background fade out after speech ends (but keep playing)
//                     let fadeOutVolume = backgroundAudio.volume;
//                     bgFadeOutIntervalId = setInterval(() => {
//                         if (fadeOutVolume > 0) {
//                             fadeOutVolume -= 0.0005; // Smooth fade out
//                             backgroundAudio.volume = Math.max(0, fadeOutVolume);
                            
//                             if (fadeOutVolume <= 0) {
//                                 clearInterval(bgFadeOutIntervalId);
//                                 backgroundAudio.pause();
//                                 backgroundAudio.currentTime = 0; // Reset for next time
//                             }
//                         }
//                     }, 50);
//                 };
                
//                 // Set up the speech end handler
//                 speechAudio.onended = onSpeechEnded;
                
//                 // Set a timeout for the ambient audio after speech
//                 speechAudioOnEndedTimeoutId = setTimeout(onSpeechEnded, 45000); // 45 seconds ambient after speech
//             };
//         } else {
//             // No background track, just play speech directly
//             speechAudio.play().catch(e => console.error("Speech audio playback failed:", e));
//             speechAudio.onended = () => {
//                 // Ensure background is off if no track was loaded
//                 backgroundAudio.pause();
//                 backgroundAudio.currentTime = 0;
//             };
//         }
//     } else {
//         console.warn('No audio link provided for the story.');
//     }
// }

// Assume speechAudio and backgroundAudio are passed or globally accessible (or get them inside functions)
// For better modularity, you could pass these elements as arguments or get them within the functions
// Here, we'll pass them to the functions that need them.

// let speechAudio;
// let backgroundAudio;
// // let period2; // Not needed anymore as per previous discussion

// // Store timeout/interval IDs for clearing
// export let bgFadeInIntervalId = null;
// export let bgFadeOutIntervalId = null;
// export let speechDelayTimeoutId = null;
// export let speechAudioOnEndedTimeoutId = null; // Renamed for clarity

// export function initAudioElements(speechEl, backgroundEl) {
//     speechAudio = speechEl;
//     backgroundAudio = backgroundEl;
//     // Don't store period2 reference as we're not using it anymore
// }

// // --- Audio Control Functions ---
// export function restartSpeech() {
//     // Clear any ongoing intervals/timeouts from previous audio states
//     if (bgFadeInIntervalId) clearInterval(bgFadeInIntervalId);
//     if (bgFadeOutIntervalId) clearInterval(bgFadeOutIntervalId);
//     if (speechDelayTimeoutId) clearTimeout(speechDelayTimeoutId);
//     if (speechAudioOnEndedTimeoutId) clearTimeout(speechAudioOnEndedTimeoutId);

//     // Ensure background audio volume is reset and playing
//     if (backgroundAudio.src) { // Only try to play if a source is set
//         backgroundAudio.volume = 0.3; // Set to 30% volume for background
//         backgroundAudio.currentTime = 0;
//         backgroundAudio.play().catch(e => console.error("Background audio restart failed:", e));
//     }

//     // Restart speech audio
//     if (speechAudio.src) { // Only try to play if a source is set
//         speechAudio.currentTime = 0;
//         speechAudio.play().catch(e => console.error("Speech audio restart failed:", e));
//     }
//     updatePlayPauseIcon();
// }

// export function togglePlayPauseSpeech() {
//     if (speechAudio.paused) {
//         if (speechAudio.src) {
//             speechAudio.play().catch(e => console.error("Speech audio play failed:", e));
//         }
//         // Ensure background audio is also playing if speech starts
//         if (backgroundAudio.paused && backgroundAudio.src) {
//             backgroundAudio.play().catch(e => console.error("Background audio play failed:", e));
//         }
//     } else {
//         speechAudio.pause();
//         // For 'Knowledge Drifting', leaving background music playing might be preferred when speech is paused.
//         // backgroundAudio.pause(); // Uncomment to pause background with speech
//     }
//     updatePlayPauseIcon();
// }

// export function updatePlayPauseIcon() {
//     // Do nothing to prevent modifying the second dot
//     // This function is kept for API compatibility
// }

// // This function will be called from main.js when audio starts playing
// export function handleAudioPlayback(data) {
//     if (data.has_audio && data.audio_url) {
//         speechAudio.src = data.audio_url;
//         speechAudio.volume = 1.0; // Set speech volume to 100%

//         if (data.track_url) {
//             backgroundAudio.src = data.track_url;
//             backgroundAudio.volume = 0; // Start muted for fade-in
//             backgroundAudio.play().catch(e => console.error("Background audio playback failed:", e));

//             const maxVolume = 0.3; // Max volume set to 30% for background
//             let bgVolume = 0;
//             bgFadeInIntervalId = setInterval(() => {
//                 if (bgVolume < maxVolume) {
//                     bgVolume += 0.005; // Small step for smooth fade
//                     backgroundAudio.volume = bgVolume;
//                 } else {
//                     clearInterval(bgFadeInIntervalId);
//                     // --- NEW: Start speech ONLY after background fade-in is complete ---
//                     speechAudio.play().catch(e => console.error("Speech audio playback failed:", e));
//                     updatePlayPauseIcon(); // Update icon (if any) once speech starts
//                 }
//             }, 50);

//             // Function to handle actions when speech ends (fires after speech, before ambient)
//             speechAudio.onended = () => {
//                 // Clear the previous speech ended timeout if a new one is set
//                 if (speechAudioOnEndedTimeoutId) clearTimeout(speechAudioOnEndedTimeoutId);

//                 // --- NEW: Dispatch custom event immediately when speech ends ---
//                 const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
//                 document.dispatchEvent(event);

//                 // Set a timeout for the ambient audio after speech (45 seconds)
//                 speechAudioOnEndedTimeoutId = setTimeout(() => {
//                     // --- NEW: Start background fade out after ambient period ---
//                     let fadeOutVolume = backgroundAudio.volume;
//                     const fadeOutDuration = 45000; // 45 seconds fade out
//                     const intervalMs = 50;
//                     const steps = fadeOutDuration / intervalMs;
//                     const volumeDecreasePerStep = fadeOutVolume / steps; // Calculate step based on current volume

//                     bgFadeOutIntervalId = setInterval(() => {
//                         if (fadeOutVolume > 0) {
//                             fadeOutVolume -= volumeDecreasePerStep; // Use calculated step
//                             backgroundAudio.volume = Math.max(0, fadeOutVolume);

//                             if (backgroundAudio.volume <= 0) { // Check actual volume after setting
//                                 clearInterval(bgFadeOutIntervalId);
//                                 backgroundAudio.pause();
//                                 backgroundAudio.currentTime = 0; // Reset for next time
//                             }
//                         } else {
//                             // Ensure it stops if for some reason it goes below 0
//                             clearInterval(bgFadeOutIntervalId);
//                             backgroundAudio.pause();
//                             backgroundAudio.currentTime = 0;
//                         }
//                     }, intervalMs); // Use the defined intervalMs
//                 }, 45000); // 45 seconds ambient after speech
//             };
//         } else {
//             // No background track, just play speech directly
//             speechAudio.play().catch(e => console.error("Speech audio playback failed:", e));
//             speechAudio.onended = () => {
//                 // Ensure background is off if no track was loaded
//                 backgroundAudio.pause();
//                 backgroundAudio.currentTime = 0;
//                 // --- NEW: Also dispatch speechEnded if no background audio ---
//                 const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
//                 document.dispatchEvent(event);
//             };
//         }
//     } else {
//         console.warn('No audio link provided for the story.');
//         // If no audio, still signal that 'speech' (or content readiness) is done
//         const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
//         document.dispatchEvent(event);
//     }
// }

// audioControls.js

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
        backgroundAudio.play().catch(e => console.error("Background audio restart failed:", e));
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
            backgroundAudio.play().catch(e => console.error("Background audio playback failed:", e));

            const maxVolume = 0.3; // Max volume set to 30% for background
            const fadeInDuration = 10000; // 10 seconds
            const intervalMs = 50;
            const steps = fadeInDuration / intervalMs;
            const volumeIncreasePerStep = maxVolume / steps;
            let bgVolume = 0;

            bgFadeInIntervalId = setInterval(() => {
                bgVolume += volumeIncreasePerStep;
                if (bgVolume >= maxVolume) {
                    backgroundAudio.volume = maxVolume;
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
                }
            }, intervalMs);

            // Function to handle speech end and cleanup
            speechAudio.onended = () => {
                // Dispatch event to show story text immediately
                const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
                document.dispatchEvent(event);

                // Wait for 40 seconds, then fade out
                speechAudioOnEndedTimeoutId = setTimeout(() => {
                    let fadeOutVolume = backgroundAudio.volume;
                    const fadeOutDuration = 35000; // 5-second fade-out
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
