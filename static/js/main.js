import { saveStoryToStorage, loadStoryFromStorage } from './storage.js';
import { initLoadingElements, showLoadingAnimation, hideLoadingAnimation } from './loadingAnimation.js';
import { initTextStreamer, streamText, clearHighlights } from './textStreamer.js';
import { initElements, playStory, clearAllAudioTimeouts, toggleLandscape, pauseAudio, resumeAudio } from './webAudioAPI.js';

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
    initElements({ speech: speechAudio, background: backgroundAudio });
    initLoadingElements(loadingAnimationContainer, loadingAnimation, period1, period2, period3, chatHistory);
    initTextStreamer(chatHistory, subjectInput);

    let state = 'Idle'

    // Initialize Web Audio API context
    // let audioContext;
    // try {
    //     audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // } catch (e) {
    //     console.warn('Web Audio API not supported in this browser');
    // }
    // Load saved story on page load
    const savedStory = loadStoryFromStorage();
    loadingAnimationContainer.style.display = 'none';
    
    let isGenerating = false;
    let currentStoryText = ''; // Store the story text received from the server

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (state !== 'Idle') return;
        state = 'Playing';
        generateButton.textContent = 'Pause';
        isGenerating = true;
        // speechAudio.pause();
        // speechAudio.currentTime = 0;
        clearAllAudioTimeouts();
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
                // --- AUDIO PLAYBACK LOGIC ---
                await playStory(data); // Play the story using webAudioAPI
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
            isGenerating = false; // Reset on error
            generateButton.disabled = false; // Re-enable on error
        }
    });

    // 2) button click handler
    generateButton.addEventListener('click', async (e) => {
        if (state === 'Idle') return;
        e.preventDefault();
        if (state === 'Playing') {
        await pauseAudio();
        generateButton.textContent = 'Resume';
        state = 'Paused';
        } else {
        await resumeAudio();
        generateButton.textContent = 'Pause';
        state = 'Playing';
        }
  });

    // --- Event Listener for when speech ends ---
    document.addEventListener('speechEnded', (event) => {
        hideLoadingAnimation(); // Hide loading dots
        streamText(currentStoryText); // Stream the text (already stored from fetch response)
        chatHistory.classList.add('text-full'); // Ensure text is fully visible, no shadow
        isGenerating = false; // Allow new generation after speech ends
        generateButton.disabled = false; // Re-enable the button
    });

    clearHighlights(); // Initial call to ensure no lingering highlights
});