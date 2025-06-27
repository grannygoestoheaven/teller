// Function to save story to localStorage
function saveStoryToStorage(story, title) {
    if (story && title) {
        const storyData = {
            content: story,
            title: title,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('lastGeneratedStory', JSON.stringify(storyData));
    }
}

// Function to load story from localStorage
function loadStoryFromStorage() {
    const savedStory = localStorage.getItem('lastGeneratedStory');
    if (savedStory) {
        try {
            const storyData = JSON.parse(savedStory);
            return {
                story: storyData.content,
                title: storyData.title
            };
        } catch (e) {
            console.error('Error parsing saved story:', e);
            return null;
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('story-form');
    const chatHistory = document.getElementById('chatHistory');
    const subjectInput = document.getElementById('subject');
    const generateButton = document.getElementById('generateButton');
    const speechAudio = document.getElementById('speechAudio');
    const backgroundAudio = document.getElementById('backgroundAudio');
    const loadingAnimationContainer = document.getElementById('loadingAnimationContainer');
    const loadingAnimation = document.getElementById('loadingAnimation'); // The div containing periods

    // Get references to the loading dots (they exist in HTML now)
    let period1 = loadingAnimation.querySelector('.period-1');
    let period2 = loadingAnimation.querySelector('.period-2');
    let period3 = loadingAnimation.querySelector('.period-3');

    // Store timeout/interval IDs for clearing
    let bgFadeInIntervalId = null;
    let bgFadeOutIntervalId = null;
    let speechDelayTimeoutId = null;
    let storyTextShadowTimeoutId = null; // For the initial text fade to shadow

    // Load saved story on page load
    const savedStory = loadStoryFromStorage();
    if (savedStory) {
        chatHistory.innerHTML = '';
        streamText(savedStory.story, chatHistory); // Stream text immediately for saved story
        chatHistory.classList.add('text-full'); // Saved story visible by default
        loadingAnimationContainer.style.display = 'none'; // Ensure loading container is hidden if story loaded
    } else {
        // If no saved story, ensure loading animation container is hidden initially
        loadingAnimationContainer.style.display = 'none';
    }

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

    // Function to show the loading animation
    function showLoadingAnimation() {
        chatHistory.innerHTML = ''; // Clear chat history content
        loadingAnimationContainer.style.display = 'flex'; // Show the container
        loadingAnimation.style.display = 'flex'; // Show the animation dots themselves

        // Reset dot classes to ensure animation plays again
        period1.className = 'period period-1';
        period2.className = 'period period-2';
        period3.className = 'period period-3';

        // Remove any interactive listeners that might be lingering
        period1.onclick = null;
        period2.onclick = null;
        period3.onclick = null;
    }

    // Function to hide the loading animation and transform dots
    function hideLoadingAnimation() {
        // Ensure the loading animation dots themselves are displayed when transforming
        // The container needs to be visible to show the transformed controls
        loadingAnimation.style.display = 'flex';
        loadingAnimationContainer.style.display = 'flex';

        // Transform dots into interactive controls
        transformDotsIntoControls();
    }

    function transformDotsIntoControls() {
        // Remove animation classes and add interactive ones for each period
        period1.classList.remove('period-1');
        period1.classList.add('interactive', 'control-restart');
        period1.textContent = '⟲'; // Unicode restart icon
        period1.onclick = () => restartSpeech();

        period2.classList.remove('period-2');
        period2.classList.add('interactive', 'control-play');
        updatePlayPauseIcon(); // Set initial icon based on speech state
        period2.onclick = () => togglePlayPauseSpeech();

        period3.classList.remove('period-3');
        period3.classList.add('interactive', 'control-toggle-text');
        period3.textContent = '👁️‍🗨️'; // Default: text is shadowed, so toggle button implies "show"
        period3.onclick = () => toggleStoryTextVisibility();

        // Optional: Hide actual story-title-display if we're not using it directly
        document.getElementById('story-title-display').style.display = 'none';
    }

    // --- NEW: Audio Control Functions ---
    function restartSpeech() {
        // Clear any ongoing intervals/timeouts from previous audio states
        if (bgFadeInIntervalId) clearInterval(bgFadeInIntervalId);
        if (bgFadeOutIntervalId) clearInterval(bgFadeOutIntervalId);
        if (speechDelayTimeoutId) clearTimeout(speechDelayTimeoutId);
        if (speechAudio.onended_timeout_id_for_fadeout) clearTimeout(speechAudio.onended_timeout_id_for_fadeout);

        // Ensure background audio volume is reset and playing
        if (backgroundAudio.src) { // Only try to play if a source is set
            backgroundAudio.volume = 0.25; // Set to target background volume
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

    function togglePlayPauseSpeech() {
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

    function updatePlayPauseIcon() {
        if (period2) {
            period2.textContent = speechAudio.paused ? '▶' : '⏸';
            period2.classList.toggle('control-play', speechAudio.paused);
            period2.classList.toggle('control-pause', !speechAudio.paused);
        }
    }

    // --- NEW: Text Visibility Toggle Function ---
    let isTextFullyVisible = false; // Default state after initial shadow fade
    function toggleStoryTextVisibility() {
        // Ensure chatHistory exists and has content before trying to toggle classes
        if (!chatHistory || chatHistory.innerHTML.trim() === '') return;

        isTextFullyVisible = !isTextFullyVisible;
        if (isTextFullyVisible) {
            chatHistory.classList.remove('text-shadow');
            chatHistory.classList.add('text-full');
            period3.textContent = '👁️'; // Eye icon: text is shown, so button indicates "hide"
        } else {
            chatHistory.classList.remove('text-full');
            chatHistory.classList.add('text-shadow');
            period3.textContent = '👁️‍🗨️'; // Eye with slash: text is shadowed, so button indicates "show"
        }
    }

    let isGenerating = false;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (isGenerating) {
            return;
        }
        isGenerating = true;
        generateButton.disabled = true;

        // Clear any previous audio intervals/timeouts
        if (bgFadeInIntervalId) clearInterval(bgFadeInIntervalId);
        if (bgFadeOutIntervalId) clearInterval(bgFadeOutIntervalId);
        if (speechDelayTimeoutId) clearTimeout(speechDelayTimeoutId);
        if (storyTextShadowTimeoutId) clearTimeout(storyTextShadowTimeoutId);
        if (speechAudio.onended_timeout_id_for_fadeout) clearTimeout(speechAudio.onended_timeout_id_for_fadeout);


        // --- Immediate fade out of any ongoing audio from previous story ---
        if (backgroundAudio.duration > 0 && !backgroundAudio.paused) {
            let fadeOutVolume = backgroundAudio.volume;
            bgFadeOutIntervalId = setInterval(() => {
                if (fadeOutVolume > 0) {
                    fadeOutVolume -= 0.05; // Faster fade out
                    backgroundAudio.volume = Math.max(0, fadeOutVolume);
                } else {
                    clearInterval(bgFadeOutIntervalId);
                    backgroundAudio.pause();
                    backgroundAudio.currentTime = 0;
                }
            }, 50);
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

                // --- Display text IMMEDIATELY and stop loading animation ---
                hideLoadingAnimation(); // Still hide loading dots even if no text, activate controls

                // --- AUDIO PLAYBACK LOGIC (adjusted to run in parallel with text) ---
                if (data.has_audio && data.audio_url) {
                    speechAudio.src = data.audio_url;
                    speechAudio.volume = 1; // Set speech volume to 100%
                    
                    if (data.track_url) {
                        backgroundAudio.src = data.track_url;
                        backgroundAudio.volume = 0; // Start muted for fade-in
                        backgroundAudio.play().catch(e => console.error("Background audio playback failed:", e));

                        let bgVolume = 0;
                        bgFadeInIntervalId = setInterval(() => {
                            if (bgVolume < 0.25) { // Target volume for background (e.g., 50%)
                                bgVolume += 0.005; // Smaller step for smoother fade
                                backgroundAudio.volume = bgVolume;
                            } else {
                                clearInterval(bgFadeInIntervalId);
                            }
                        }, 50);

                        // Delay speech playback
                        speechDelayTimeoutId = setTimeout(() => {
                            if (data.story) {
                                hideLoadingAnimation(); // Stops loading dots and activates controls
                                streamText(data.story, chatHistory);
            
                                // Initial text animation: show fully then fade to shadow
                                chatHistory.classList.remove('text-shadow');
                                chatHistory.classList.add('text-full'); // Start full opacity
                                isTextFullyVisible = true; // Set internal state to fully visible
                                if (period3) period3.textContent = '👁️'; // Set icon to 'hide'
            
                                storyTextShadowTimeoutId = setTimeout(() => {
                                    chatHistory.classList.remove('text-full');
                                    chatHistory.classList.add('text-shadow'); // Transition to shadow
                                    isTextFullyVisible = false; // Internal state set to shadowed
                                    if (period3) period3.textContent = '👁️‍🗨️'; // Set icon to 'show'
                                }, 5000); // Show text fully for 5 seconds, then fade to shadow
                                
                                const storyTitle = subject || 'Untitled Story';
                                saveStoryToStorage(data.story, storyTitle);
                            } else {
                                 if (!data.audio_url) {
                                    chatHistory.innerHTML = '<div class="message error">Generated response is missing story text and audio.</div>';
                                }
                            }
                            speechAudio.play().catch(e => console.error("Speech audio playback failed:", e));
                            updatePlayPauseIcon();
                        }, 8000); // 8-second delay before speech starts

                        speechAudio.onended = () => {
                            // Clear the previous speech ended timeout if a new one is set
                            if (speechAudio.onended_timeout_id_for_fadeout) clearTimeout(speechAudio.onended_timeout_id_for_fadeout);

                            speechAudio.onended_timeout_id_for_fadeout = setTimeout(() => { // Store this timeout ID
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

            } else {
                const errorText = await response.text();
                throw new Error(`Server responded with status ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            chatHistory.innerHTML = `<div class="message error">Error generating story: ${error.message}. Please try again.</div>`;
            hideLoadingAnimation(); // Ensure controls are activated even on error
        } finally {
            isGenerating = false;
            generateButton.disabled = false;
        }
    });

    // Function to stream text with typing effect and add interactivity
    async function streamText(text, container) {
        container.innerHTML = ''; // Clear container before streaming
        // The .story-content-wrapper class is now on #chatHistory itself, controlled by submit handler
        // No explicit class to add here for general story content, only for opacity states

        const delay = 20; // Base delay in milliseconds
        const parts = text.match(/(\w+|[^\w\s]|\s+)/g);

        if (!parts) {
             const cursor = document.createElement('span');
             cursor.className = 'cursor-standby';
             container.appendChild(cursor);
            return;
        }

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            let node;

            if (/\w+/.test(part)) { // If it's a word
                node = document.createElement('span');
                node.textContent = part;
                node.classList.add('word'); // Add a class to identify word spans
                node.addEventListener('click', handleWordClick); // Click listener
            } else { // If it's spaces or punctuation
                 node = document.createTextNode(part);
            }

            container.appendChild(node);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

         const existingCursor = container.querySelector('.cursor-standby');
         if (existingCursor) {
             existingCursor.remove();
         }

         const finalCursor = document.createElement('span');
         finalCursor.className = 'cursor-standby';
         container.appendChild(finalCursor);

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseout', handleMouseOut);
    }

     // Helper function to find the next word span in the history
    function findNextWordSpan(currentSpan) {
        let nextNode = currentSpan.nextSibling;
        while (nextNode) {
            if (nextNode.nodeType === Node.ELEMENT_NODE && nextNode.classList.contains('word') && nextNode.parentElement === chatHistory) {
                return nextNode;
            }
            nextNode = nextNode.nextSibling;
        }
        return null;
    }

    // Handles clicking on a word span in the chat history
    let currentlyHighlightedWords = []; // Ensure this is declared outside if it wasn't
    function handleWordClick(event) {
        if (currentlyHighlightedWords.length === 0) {
            return;
        }

        const wordsToToggleSet = new Set(currentlyHighlightedWords.map(span => span.textContent.trim()));
        let subjectWordsSet = new Set(subjectInput.value.trim().split(/\s+/).filter(word => word.length > 0));

        wordsToToggleSet.forEach(word => {
            if (subjectWordsSet.has(word)) {
                subjectWordsSet.delete(word);
            } else {
                subjectWordsSet.add(word);
            }
        });
        subjectInput.value = Array.from(subjectWordsSet).join(' ');
    }

    // Handles mouse movement for highlighting
    function handleMouseMove(event) {
        const target = event.target;
        const parent = target.parentElement;

        if (parent === chatHistory) {
            clearHighlights();

            if (target.classList && target.classList.contains('word')) {
                const rect = target.getBoundingClientRect();
                const mouseYRelativeToSpanTop = event.clientY - rect.top;
                const spanHeight = rect.height;

                target.classList.add('highlight-word');
                currentlyHighlightedWords.push(target);

                let zone = 10 - Math.floor((mouseYRelativeToSpanTop / spanHeight) * 10);
                zone = Math.max(1, Math.min(zone, 10));
                let wordsToHighlight = zone;

                let currentSpan = target;
                for (let i = 0; i < wordsToHighlight - 1; i++) {
                    const nextWord = findNextWordSpan(currentSpan);
                    if (nextWord) {
                        nextWord.classList.add('highlight-word');
                        currentlyHighlightedWords.push(nextWord);
                        currentSpan = nextWord;
                    } else {
                        break;
                    }
                }
            } else if (target.nodeType === Node.TEXT_NODE) {
                 let prevElement = target.previousElementSibling;
                 let nextElement = target.nextElementSibling;

                 if (prevElement && prevElement.classList.contains('word')) {
                     prevElement.classList.add('highlight-word');
                     currentlyHighlightedWords.push(prevElement);
                 }
                 if (nextElement && nextElement.classList.contains('word')) {
                     nextElement.classList.add('highlight-word');
                     currentlyHighlightedWords.push(nextElement);
                 }
            }
        } else {
             clearHighlights();
        }
    }

    // Handles mouse leaving the chat history area
    function handleMouseOut(event) {
        if (!event.relatedTarget || !chatHistory.contains(event.relatedTarget)) {
             clearHighlights();
        }
    }

    // Clears all currently highlighted word spans
    function clearHighlights() {
        currentlyHighlightedWords.forEach(span => {
            span.classList.remove('highlight-word');
        });
        currentlyHighlightedWords = [];
    }

    clearHighlights(); // Initial call to ensure no lingering highlights
});