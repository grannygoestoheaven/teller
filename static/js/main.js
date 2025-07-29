// import { saveStoryToStorage, loadStoryFromStorage } from './storage.js';
// import { initLoadingElements, showLoadingAnimation, hideLoadingAnimation } from './loadingAnimation.js';
// import { initTextStreamer, streamText, clearHighlights } from './textStreamer.js';
// import { initElements, playStory, clearAllAudioTimeouts, toggleLandscape, pauseAudio, resumeAudio } from './webAudioAPI.js';
// import { initAudioElements, handleAudioPlayback, togglePlayPauseSpeech } from './audioControls.js';
// import { pauseTracks, resumeTracks} from './webAudioAPI.js';

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
//     // initElements({ speech: speechAudio, background: backgroundAudio });
//     initAudioElements({ speech: speechAudio, background: backgroundAudio });
//     initLoadingElements(loadingAnimationContainer, loadingAnimation, period1, period2, period3, chatHistory);
//     initTextStreamer(chatHistory, subjectInput);

//     let state = 'Idle'

//     // Initialize Web Audio API context
//     // let audioContext;
//     // try {
//     //     audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     // } catch (e) {
//     //     console.warn('Web Audio API not supported in this browser');
//     // }
//     // Load saved story on page load
//     const savedStory = loadStoryFromStorage();
//     loadingAnimationContainer.style.display = 'none';
    
//     let isGenerating = false;
//     let currentStoryText = ''; // Store the story text received from the server

// //     form.addEventListener('submit', async function(e) {
// //         e.preventDefault();
// //         if (state !== 'Idle') return;
// //         state = 'Playing';
// //         generateButton.textContent = 'Pause';
// //         isGenerating = true;
// //         // speechAudio.pause();
// //         // speechAudio.currentTime = 0;
// //         clearAllAudioTimeouts();
// //         showLoadingAnimation(); // Display loading dots
// //         const subject = subjectInput.value.trim();
// //         subjectInput.value = '';
// //         try {
// //             const formData = new FormData();
// //             formData.append('subject', subject);

// //             const response = await fetch('/generate_story', {
// //                 method: 'POST',
// //                 body: formData
// //             });
// //             if (response.ok) {
// //                 const data = await response.json();
// //                 currentStoryText = data.story; // Store the story text
// //                 // --- AUDIO PLAYBACK LOGIC ---
// //                 await playStory(data); // Play the story using webAudioAPI
// //                 // Save story immediately (as soon as we have it from backend)
// //                 const storyTitle = subject || 'Untitled Story';
// //                 saveStoryToStorage(data.story, storyTitle);
// //             } else {
// //                 const errorText = await response.text();
// //                 throw new Error(`Server responded with status ${response.status}: ${errorText}`);
// //             }
// //         } catch (error) {
// //             console.error('Error:', error);
// //             chatHistory.innerHTML = `<div class="message error">Error generating story: ${error.message}. Please try again.</div>`;
// //             hideLoadingAnimation(); // Ensure controls are activated even on error
// //             isGenerating = false; // Reset on error
// //             generateButton.disabled = false; // Re-enable on error
// //         }
// //     });

// //     // 2) button click handler
// //     generateButton.addEventListener('click', async (e) => {
// //         if (state === 'Idle') return;
// //         e.preventDefault();
// //         if (state === 'Playing') {
// //             pauseTracks(); // Pause both background and speech audio
// //             await pauseAudio(); // Pause the Web Audio API context
// //             generateButton.textContent = 'Resume';
// //             state = 'Paused';
// //         } else if (state === 'Paused') {
// //             await resumeAudio();
// //             resumeTracks(); // Resume both background and speech audio
// //             generateButton.textContent = 'Pause';
// //             state = 'Playing';
// //         }
// //   });

// //     // --- Event Listener for when speech ends ---
// //     document.addEventListener('speechEnded', (event) => {
// //         hideLoadingAnimation(); // Hide loading dots
// //         streamText(currentStoryText); // Stream the text (already stored from fetch response)
// //         chatHistory.classList.add('text-full'); // Ensure text is fully visible, no shadow
// //         isGenerating = false; // Allow new generation after speech ends
// //         generateButton.disabled = false; // Re-enable the button
// //     });

//     form.addEventListener('submit', async function(e) {
//         e.preventDefault();
//         if (state !== 'Idle') return;
    
//         state = 'Playing';
//         generateButton.textContent = 'Pause';
//         isGenerating = true;
    
//         showLoadingAnimation();  // clears old text + shows dots
    
//         const subject = subjectInput.value.trim();
//         subjectInput.value = '';
    
//         try {
//         const formData = new FormData();
//         formData.append('subject', subject);
    
//         const response = await fetch('/generate_story', {
//             method: 'POST',
//             body: formData
//         });
    
//         if (!response.ok) {
//             const err = await response.json();
//             throw new Error(err.error || `Server error ${response.status}`);
//         }
    
//         const data = await response.json();
//         currentStoryText = data.story;
    
//         // All audio scheduling is done in playStory()
//         // await playStory(data);
//         await handleAudioPlayback(data);

//         // Save once playback is scheduled
//         saveStoryToStorage(data.story, subject || 'Untitled Story');
    
//         } catch (error) {
//         console.error(error);
//         hideLoadingAnimation();
//         chatHistory.innerHTML =
//             `<div class="message error">Error: ${error.message}</div>`;
//         isGenerating = false;
//         state = 'Idle';
//         generateButton.textContent = 'Play';
//         }
//     });
    
//     // Pause/Resume toggle
//     generateButton.addEventListener('click', async (e) => {
//         if (state === 'Idle') {
//         // let form submit handle it
//         return;
//         }
//         e.preventDefault();
    
//         if (state === 'Playing') {
//         // freeze all scheduled audio and rendering
//         // await pauseAudio();
//         await togglePlayPauseSpeech();
//         generateButton.textContent = 'Resume';
//         state = 'Paused';
        
//     } else if (state === 'Paused') {
//         // await resumeAudio();
//         await togglePlayPauseSpeech()  
//         generateButton.textContent = 'Pause';
//         state = 'Playing';
//         }
//     });
    
//     // When speech really ends, clean up UI
//     document.addEventListener('speechEnded', () => {
//         hideLoadingAnimation();
//         streamText(currentStoryText);
//         chatHistory.classList.add('text-full');
//         isGenerating = false;
//         state = 'Idle';
//         generateButton.textContent = 'Play';
//     });
  
//     clearHighlights(); // Initial call to ensure no lingering highlights
// });

import { saveStoryToStorage, loadStoryFromStorage } from './storage.js';
import { initLoadingElements, showLoadingAnimation, hideLoadingAnimation } from './loadingAnimation.js';
import { initTextStreamer, streamText, clearHighlights } from './textStreamer.js';
import { initAudioElements, handleAudioPlayback, togglePlayPauseSpeech } from './audioControls.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('story-form');
    const chatHistory = document.getElementById('chatHistory');
    const subjectInput = document.getElementById('subject');
    const generateButton = document.getElementById('generateButton');
    const speechAudio = document.getElementById('speechAudio');
    const backgroundAudio = document.getElementById('backgroundAudio');
    const loadingAnimationContainer = document.getElementById('loadingAnimationContainer');
    const loadingAnimation = document.getElementById('loadingAnimation');

    const period1 = loadingAnimation.querySelector('.period-1');
    const period2 = loadingAnimation.querySelector('.period-2');
    const period3 = loadingAnimation.querySelector('.period-3');

    initAudioElements({ speech: speechAudio, background: backgroundAudio });
    initLoadingElements(loadingAnimationContainer, loadingAnimation, period1, period2, period3, chatHistory);
    initTextStreamer(chatHistory, subjectInput);

    const savedStory = loadStoryFromStorage();
    loadingAnimationContainer.style.display = 'none';

    let currentStoryText = '';
    let state = 'Idle'; // "Idle" | "Playing" | "Paused"
    let isGenerating = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (state !== 'Idle') return;

        const subject = subjectInput.value.trim();
        if (!subject) return;

        state = 'Playing';
        generateButton.textContent = 'Pause';
        isGenerating = true;

        showLoadingAnimation();
        subjectInput.value = '';

        try {
            const formData = new FormData();
            formData.append('subject', subject);

            const response = await fetch('/generate_story', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || `Server error ${response.status}`);
            }

            const data = await response.json();
            currentStoryText = data.story;

            await handleAudioPlayback(data);
            saveStoryToStorage(data.story, subject || 'Untitled Story');

        } catch (error) {
            console.error(error);
            hideLoadingAnimation();
            chatHistory.innerHTML = `<div class="message error">Error: ${error.message}</div>`;
            isGenerating = false;
            state = 'Idle';
            generateButton.textContent = 'Play';
        }
    });

    generateButton.addEventListener('click', async (e) => {
        if (state === 'Idle') return;

        e.preventDefault();

        await togglePlayPauseSpeech();

        if (state === 'Playing') {
            state = 'Paused';
            generateButton.textContent = 'Resume';
        } else if (state === 'Paused') {
            state = 'Playing';
            generateButton.textContent = 'Pause';
        }
    });

    document.addEventListener('speechEnded', () => {
        hideLoadingAnimation();
        streamText(currentStoryText);
        chatHistory.classList.add('text-full');
        isGenerating = false;
        state = 'Idle';
        generateButton.textContent = 'Play';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && state === 'Idle' && document.activeElement === subjectInput) {
            e.preventDefault();
            form.requestSubmit();
        }
    
        if (e.key === ' ' && (state === 'Playing' || state === 'Paused')) {
            e.preventDefault();
            generateButton.click();
        }
    });    

    clearHighlights();
});
