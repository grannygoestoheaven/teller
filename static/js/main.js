// import { saveStoryToStorage, loadStoryFromStorage } from './storage.js';
// import { initLoadingElements, showLoadingAnimation, hideLoadingAnimation, toggleStoryTextVisibility, setStoryTextShadowTimeout, clearStoryTextShadowTimeout } from './loadingAnimation.js';
// import { initTextStreamer, streamText, clearHighlights } from './textStreamer.js';
// import { initAudioElements, bgFadeInIntervalId, bgFadeOutIntervalId, speechDelayTimeoutId, speechAudioOnEndedTimeoutId, handleAudioPlayback } from './audioControls.js';


// document.addEventListener('DOMContentLoaded', async () => {
//     const form = document.getElementById('story-form');
//     const chatHistory = document.getElementById('chatHistory');
//     const subjectInput = document.getElementById('subject');
//     const generateButton = document.getElementById('generateButton');
//     const speechAudio = document.getElementById('speechAudio');
//     const backgroundAudio = document.getElementById('backgroundAudio');
//     const loadingAnimationContainer = document.getElementById('loadingAnimationContainer');
//     const loadingAnimation = document.getElementById('loadingAnimation'); // The div containing periods

//     // Get references to the loading dots (they exist in HTML)
//     let period1 = loadingAnimation.querySelector('.period-1');
//     let period2 = loadingAnimation.querySelector('.period-2');
//     let period3 = loadingAnimation.querySelector('.period-3');

//     // Initialize modules with necessary DOM elements
//     initAudioElements(speechAudio, backgroundAudio);
//     initLoadingElements(loadingAnimationContainer, loadingAnimation, period1, period2, period3, chatHistory);
//     initTextStreamer(chatHistory, subjectInput);

//     // Create audio context for sound effects (for UI clicks, not main audio)
//     let audioContext;
//     try {
//         audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     } catch (e) {
//         console.warn('Web Audio API not supported in this browser');
//     }

//     // Function to play click sound (if needed, currently not used on generateButton)
//     function playClickSound() {
//         if (!audioContext) return;

//         const oscillator = audioContext.createOscillator();
//         const gainNode = audioContext.createGain();

//         oscillator.type = 'sine';
//         oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
//         oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.05);

//         gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

//         oscillator.connect(gainNode);
//         gainNode.connect(audioContext.destination);

//         oscillator.start();
//         oscillator.stop(audioContext.currentTime + 0.1);
//     }

//     // Load saved story on page load
//     const savedStory = loadStoryFromStorage();
//     if (savedStory) {
//         chatHistory.innerHTML = '';
//         // streamText(savedStory.story); // Stream text immediately for saved story
//         // chatHistory.classList.add('text-full'); // Saved story visible by default
//         loadingAnimationContainer.style.display = 'none'; // Ensure loading container is hidden if story loaded
//     } else {
//         // If no saved story, ensure loading animation container is hidden initially
//         loadingAnimationContainer.style.display = 'none';
//     }

//     let isGenerating = false;

//     form.addEventListener('submit', async function(e) {
//         e.preventDefault();

//         if (isGenerating) {
//             return;
//         }
//         isGenerating = true;
//         generateButton.disabled = true;

//         // Clear any previous audio intervals/timeouts using the imported IDs
//         if (bgFadeInIntervalId) clearInterval(bgFadeInIntervalId);
//         if (bgFadeOutIntervalId) clearInterval(bgFadeOutIntervalId);
//         if (speechDelayTimeoutId) clearTimeout(speechDelayTimeoutId);
//         if (speechAudioOnEndedTimeoutId) clearTimeout(speechAudioOnEndedTimeoutId);
//         clearStoryTextShadowTimeout(); // Clear from loadingAnimation module


//         // --- Immediate fade out of any ongoing audio from previous story ---
//         if (backgroundAudio.duration > 0 && !backgroundAudio.paused) {
//             let fadeOutVolume = backgroundAudio.volume;
//             bgFadeOutIntervalId = setInterval(() => {
//                 if (fadeOutVolume > 0) {
//                     fadeOutVolume -= 0.05; // Faster fade out
//                     backgroundAudio.volume = Math.max(0, fadeOutVolume);
//                 } else {
//                     clearInterval(bgFadeOutIntervalId);
//                     backgroundAudio.pause();
//                     backgroundAudio.currentTime = 0;
//                 }
//             }, 50);
//         }
//         speechAudio.pause();
//         speechAudio.currentTime = 0;
//         // --- END NEW HANDLING ---

//         showLoadingAnimation(); // Display loading dots

//         const subject = subjectInput.value.trim();
//         subjectInput.value = '';

//         try {
//             const formData = new FormData();
//             formData.append('subject', subject);

//             const response = await fetch('/generate_story', {
//                 method: 'POST',
//                 body: formData
//             });

//             if (response.ok) {
//                 const data = await response.json();

//                 // --- Display text IMMEDIATELY and stop loading animation ---
//                 if (data.story) {
//                     hideLoadingAnimation(); // Stops loading dots and activates controls
//                     streamText(data.story);

//                     // Initial text animation: show fully then fade to shadow
//                     chatHistory.classList.remove('text-shadow');
//                     chatHistory.classList.add('text-full'); // Start full opacity
//                     // isTextFullyVisible = true; // State is managed internally by toggleStoryTextVisibility
//                     toggleStoryTextVisibility(); // This will set it to fully visible and update icon

//                     const shadowTimeoutId = setTimeout(() => {
//                         toggleStoryTextVisibility(); // This will set it to shadowed and update icon
//                     }, 5000); // Show text fully for 5 seconds, then fade to shadow
//                     setStoryTextShadowTimeout(shadowTimeoutId); // Store this timeout ID

//                     const storyTitle = subject || 'Untitled Story';
//                     saveStoryToStorage(data.story, storyTitle);
//                 } else {
//                      if (!data.audio_url) {
//                         chatHistory.innerHTML = '<div class="message error">Generated response is missing story text and audio.</div>';
//                     }
//                     hideLoadingAnimation(); // Still hide loading dots even if no text, activate controls
//                 }

//                 // --- AUDIO PLAYBACK LOGIC (adjusted to run in parallel with text) ---
//                 handleAudioPlayback(data); // Call the function from audioControls module

//             } else {
//                 const errorText = await response.text();
//                 throw new Error(`Server responded with status ${response.status}: ${errorText}`);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             chatHistory.innerHTML = `<div class="message error">Error generating story: ${error.message}. Please try again.</div>`;
//             hideLoadingAnimation(); // Ensure controls are activated even on error
//         } finally {
//             isGenerating = false;
//             generateButton.disabled = false;
//         }
//     });

//     clearHighlights(); // Initial call to ensure no lingering highlights
// });

import { saveStoryToStorage, loadStoryFromStorage } from './storage.js';
import { initLoadingElements, showLoadingAnimation, hideLoadingAnimation, /* Removed: toggleStoryTextVisibility, setStoryTextShadowTimeout, clearStoryTextShadowTimeout */ } from './loadingAnimation.js';
import { initTextStreamer, streamText, clearHighlights } from './textStreamer.js';
import { initAudioElements, bgFadeInIntervalId, bgFadeOutIntervalId, speechDelayTimeoutId, speechAudioOnEndedTimeoutId, handleAudioPlayback } from './audioControls.js';


document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('story-form');
    const chatHistory = document.getElementById('chatHistory');
    const subjectInput = document.getElementById('subject');
    const generateButton = document.getElementById('generateButton');
    const speechAudio = document.getElementById('speechAudio');
    const backgroundAudio = document.getElementById('backgroundAudio');
    const loadingAnimationContainer = document.getElementById('loadingAnimationContainer');
    const loadingAnimation = document.getElementById('loadingAnimation'); // The div containing periods

    // Get references to the loading dots (they exist in HTML)
    let period1 = loadingAnimation.querySelector('.period-1');
    let period2 = loadingAnimation.querySelector('.period-2');
    let period3 = loadingAnimation.querySelector('.period-3');

    // Initialize modules with necessary DOM elements
    initAudioElements(speechAudio, backgroundAudio);
    initLoadingElements(loadingAnimationContainer, loadingAnimation, period1, period2, period3, chatHistory);
    initTextStreamer(chatHistory, subjectInput);

    // Create audio context for sound effects (for UI clicks, not main audio)
    let audioContext;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Web Audio API not supported in this browser');
    }

    // Function to play click sound (if needed, currently not used on generateButton)
    function playClickSound() {
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    // Load saved story on page load
    const savedStory = loadStoryFromStorage();
    if (savedStory) {
        chatHistory.innerHTML = '';
        // If a saved story exists, we want to immediately display it without streaming or animations
        streamText(savedStory.story); // Display saved text immediately
        chatHistory.classList.add('text-full'); // Ensure it's fully visible
        loadingAnimationContainer.style.display = 'none'; // Ensure loading container is hidden if story loaded
    } else {
        // If no saved story, ensure loading animation container is hidden initially
        loadingAnimationContainer.style.display = 'none';
    }

    let isGenerating = false;
    let currentStoryText = ''; // Store the story text received from the server

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (isGenerating) {
            return;
        }
        isGenerating = true;
        generateButton.disabled = true;

        // Clear any previous audio intervals/timeouts using the imported IDs
        if (bgFadeInIntervalId) clearInterval(bgFadeInIntervalId);
        if (bgFadeOutIntervalId) clearInterval(bgFadeOutIntervalId);
        if (speechDelayTimeoutId) clearTimeout(speechDelayTimeoutId); // No longer strictly needed if speech starts after fade-in
        if (speechAudioOnEndedTimeoutId) clearTimeout(speechAudioOnEndedTimeoutId);
        // Removed: clearStoryTextShadowTimeout(); // Clear from loadingAnimation module


        // --- Immediate fade out of any ongoing audio from previous story ---
        if (backgroundAudio.duration > 0 && !backgroundAudio.paused) {
            let fadeOutVolume = backgroundAudio.volume;
            // Use same fade out duration as desired for general end of story fade out (45 seconds)
            const fadeOutDuration = 45000;
            const intervalMs = 50;
            const steps = fadeOutDuration / intervalMs;
            const volumeDecreasePerStep = fadeOutVolume / steps;

            bgFadeOutIntervalId = setInterval(() => {
                if (fadeOutVolume > 0) {
                    fadeOutVolume -= volumeDecreasePerStep; // Use calculated step
                    backgroundAudio.volume = Math.max(0, fadeOutVolume);
                } else {
                    clearInterval(bgFadeOutIntervalId);
                    backgroundAudio.pause();
                    backgroundAudio.currentTime = 0;
                }
            }, intervalMs);
        }
        speechAudio.pause();
        speechAudio.currentTime = 0;
        // --- END NEW HANDLING ---

        showLoadingAnimation(); // Display loading dots

        const subject = subjectInput.value.trim();
        subjectInput.value = '';

        try {
            const formData = new FormData();
            formData.append('subject', subject);

            const response = await fetch('/generate_story', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                currentStoryText = data.story; // Store the story text

                // --- AUDIO PLAYBACK LOGIC (adjusted to run in parallel with text generation, but speech delayed) ---
                handleAudioPlayback(data); // Call the function from audioControls module

                // --- NEW: Remove immediate text display and loading animation hide ---
                // The text display and hiding of loading animation will now happen
                // when the 'speechEnded' event is fired.

                // Save story immediately (as soon as we have it from backend)
                const storyTitle = subject || 'Untitled Story';
                saveStoryToStorage(data.story, storyTitle);

            } else {
                const errorText = await response.text();
                throw new Error(`Server responded with status ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            chatHistory.innerHTML = `<div class="message error">Error generating story: ${error.message}. Please try again.</div>`;
            hideLoadingAnimation(); // Ensure controls are activated even on error
            isGenerating = false;
            generateButton.disabled = false;
        }
    });

    // --- NEW: Event Listener for when speech ends ---
    document.addEventListener('speechEnded', (event) => {
        hideLoadingAnimation(); // Hide loading dots
        streamText(currentStoryText); // Stream the text (already stored from fetch response)
        chatHistory.classList.add('text-full'); // Ensure text is fully visible, no shadow
        // No need for toggleStoryTextVisibility or shadow timeouts here
        isGenerating = false; // Allow new generation after speech ends
        generateButton.disabled = false; // Re-enable the button
    });

    clearHighlights(); // Initial call to ensure no lingering highlights
});