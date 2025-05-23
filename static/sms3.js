document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('story-form');
    const chatHistory = document.getElementById('chatHistory');
    const subjectInput = document.getElementById('subject');
    const generateButton = document.getElementById('generateButton');
    
    // Create audio context for sound effects
    let audioContext;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Web Audio API not supported in this browser');
    }
    
    // Function to play click sound
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
        chatHistory.innerHTML = ''; // Clear previous content first

        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-animation'; // Assign an ID for easier removal
        loadingDiv.className = 'loading-animation';
        loadingDiv.innerHTML = `
            <span class="colon colon-1">:</span>
            <span class="colon colon-2">:</span>
            <span class="colon colon-3">:</span>
        `;
        chatHistory.appendChild(loadingDiv);
    }

    // Function to hide the loading animation
    function hideLoadingAnimation() {
        const loadingDiv = document.getElementById('loading-animation');
        if (loadingDiv) {
            loadingDiv.remove(); // Remove the loading div from the DOM
        }
    }
    
    // Available ambient tracks
    const ambientTracks = [
        { name: 'Ambient Track 1', color: 'rgba(100, 181, 246, 0.8)' },
        { name: 'Ambient Track 2', color: 'rgba(129, 199, 132, 0.8)' },
        { name: 'Ambient Track 3', color: 'rgba(255, 183, 77, 0.8)' },
        { name: 'No Track', color: 'rgba(255, 255, 255, 0.1)' }
    ];
    let currentTrackIndex = 0;
    let isGenerating = false;
    
    // Update subject display - now essentially a placeholder or can be removed
    function updateSubjectDisplay() {
    }
    
    // Show/hide elements based on input focus
    subjectInput.addEventListener('focus', () => {
    });
    
    subjectInput.addEventListener('blur', () => {
        updateSubjectDisplay();
    });
    
    // Update subject display when input changes
    subjectInput.addEventListener('input', updateSubjectDisplay);
    
    // --- Start: New Length Selector Logic ---
    const lengthSelector = document.getElementById('length-selector-container');
    const lengthDisplay = document.getElementById('length-display-value');
    const userLengthInput = document.getElementById('user_length_input');

    if (lengthSelector && lengthDisplay && userLengthInput) {
        let currentLength = parseInt(userLengthInput.value, 10) || 1;
        const minLength = 1;
        const maxLength = 12; // Adjust max length as desired

        // Function to update display and hidden input
        function updateLengthDisplay() {
            lengthDisplay.textContent = currentLength;
            userLengthInput.value = currentLength;
        }

        // Initialize display
        updateLengthDisplay();

        lengthSelector.addEventListener('wheel', function(event) {
            event.preventDefault(); // Prevent page scrolling
            event.stopPropagation(); // Stop event from bubbling up

            // Determine scroll direction
            if (event.deltaY < 0) {
                // Scrolled up
                currentLength++;
            } else if (event.deltaY > 0) {
                // Scrolled down
                currentLength--;
            }

            // Clamp the value within min/max
            if (currentLength < minLength) {
                currentLength = minLength;
            }
            if (currentLength > maxLength) {
                currentLength = maxLength;
            }

            updateLengthDisplay();
        });
    }
    // --- End: New Length Selector Logic ---

    let currentlyHighlightedWords = [];

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Ensure default submission is prevented

        if (isGenerating) { // If already generating, do nothing
            return;
        }
        isGenerating = true; // Set generating state
        generateButton.disabled = true; // Disable button immediately
        playClickSound(); // Play click sound

        // Clear previous content from chat history
        chatHistory.innerHTML = '';
        
        // Show loading animation
        showLoadingAnimation();
        
        // Store the subject before clearing the form
        const subject = subjectInput.value.trim();
        
        // Clear the form (after storing the subject)
        subjectInput.value = '';

        // Show standby cursor
        const cursor = document.createElement('span');
        cursor.className = 'cursor-standby';
        chatHistory.appendChild(cursor);

        // Clear any previous highlights
        clearHighlights();

        try {
            const formData = new FormData();
            // Explicitly add the subject to the form data
            formData.append('subject', subject);
            
            const response = await fetch('/generate_story', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();

                // Load and play audio if available
                if (data.audio_link && typeof window.loadAndPlayTrack === 'function') {
                    window.loadAndPlayTrack(data.audio_link, data.title || 'Generated Story');
                } else if (data.audio_link) {
                    console.warn('window.loadAndPlayTrack is not available, cannot play audio automatically.');
                }

                if (data.story) {
                    await streamText(data.story, chatHistory);
                } else {
                    // If no story text, but audio might have been loaded.
                    // Display error only if no audio was provided either.
                    if (!data.audio_link) {
                        chatHistory.innerHTML = '<div class="message error">Generated response is missing story text and audio.</div>';
                    }
                }
            } else {
                const errorText = await response.text();
                throw new Error(`Server responded with status ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            chatHistory.innerHTML = `<div class="message error">Error generating story: ${error.message}. Please try again.</div>`;
            const existingCursor = chatHistory.querySelector('.cursor-standby');
            if (existingCursor) {
                existingCursor.remove();
            }
        } finally {
            isGenerating = false; // Reset generating state
            generateButton.disabled = false; // Re-enable button
            // 3. Hide loading animation when done (success or error)
            hideLoadingAnimation();
        }
    });

    // Function to stream text with typing effect and add interactivity
    async function streamText(text, container) {
        container.innerHTML = ''; // Clear container before streaming
        const delay = 20; // Base delay in milliseconds (slightly faster)

        // Regex to split words, spaces, and punctuation separately
        // \w+ : one or more word characters (letters, numbers, underscore)
        // [^\w\s] : a single character that is NOT a word character AND NOT a whitespace
        // \s+ : one or more whitespace characters
        const parts = text.match(/(\w+|[^\w\s]|\s+)/g);

        if (!parts) {
             // Handle empty text - maybe append a message or just the cursor
             const cursor = document.createElement('span');
             cursor.className = 'cursor-standby'; // Keep cursor if no text
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

                // Click listener is added here, but the logic will read currentlyHighlightedWords
                node.addEventListener('click', handleWordClick);

            } else { // If it's spaces or punctuation
                // Create as text nodes so they don't interfere with span highlighting
                 node = document.createTextNode(part);
            }

            container.appendChild(node); // Add the node to the container

            // Introduce a small delay for the typing effect
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Remove the initial standby cursor if it's still there after streaming
         const existingCursor = container.querySelector('.cursor-standby');
         if (existingCursor) {
             existingCursor.remove();
         }

         // Add a final cursor after the text finishes typing
         const finalCursor = document.createElement('span');
         finalCursor.className = 'cursor-standby';
         container.appendChild(finalCursor);


        // Attach mousemove and mouseout listeners to the container after streaming
        // Remove previous listeners first if streamText can be called multiple times
        // (Though in this flow, it's typically only called once per submit)
        // container.removeEventListener('mousemove', handleMouseMove);
        // container.removeEventListener('mouseout', handleMouseOut);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseout', handleMouseOut);
    }

     // Helper function to find the next word span in the history
    function findNextWordSpan(currentSpan) {
        let nextNode = currentSpan.nextSibling;
        while (nextNode) {
            // Check if it's an element node (type 1) and has the 'word' class
            // We also check parentElement to ensure it's a direct child of chatHistory,
            // although the streaming logic should guarantee this.
            if (nextNode.nodeType === Node.ELEMENT_NODE && nextNode.classList.contains('word') && nextNode.parentElement === chatHistory) {
                return nextNode; // Found the next word span
            }
            nextNode = nextNode.nextSibling;
        }
        return null; // No next word span found
    }


    // Handles clicking on a word span in the chat history
    function handleWordClick(event) {
        // We now toggle ALL currently highlighted words, not just the clicked one
        if (currentlyHighlightedWords.length === 0) {
            // If nothing is highlighted (e.g., mouse left the span before clicking), do nothing
            return;
        }

        // Get the text content of all currently highlighted words
        // Use Set to get unique words from the currently highlighted list
        const wordsToToggleSet = new Set(currentlyHighlightedWords.map(span => span.textContent.trim()));

        // Get current words in the subject input, split by space and filter empty
        // Using a Set helps manage unique words easily in the subject input
        let subjectWordsSet = new Set(subjectInput.value.trim().split(/\s+/).filter(word => word.length > 0));

        wordsToToggleSet.forEach(word => {
            if (subjectWordsSet.has(word)) {
                // Word is in subject, remove it from the set
                subjectWordsSet.delete(word);
            } else {
                // Word is not in subject, add it to the set
                subjectWordsSet.add(word);
            }
        });

        // Update the subject input value by joining the words from the set
        subjectInput.value = Array.from(subjectWordsSet).join(' ');

        // Optional: Clear highlights after selection
        // clearHighlights(); // Keeping words highlighted until mouse moves off seems more intuitive
    }

    // Handles mouse movement for highlighting
    function handleMouseMove(event) {
        const target = event.target;
        const parent = target.parentElement;

        // Check if the mouse is over an element directly within chatHistory
        // or over a text node directly within chatHistory
        if (parent === chatHistory) {
             // Always clear previous highlights before determining new ones
            clearHighlights();

            if (target.classList && target.classList.contains('word')) {
                // Mouse is over a word span
                const rect = target.getBoundingClientRect();
                const mouseYRelativeToSpanTop = event.clientY - rect.top;
                const spanHeight = rect.height;

                // Always highlight the current word
                target.classList.add('highlight-word');
                currentlyHighlightedWords.push(target);

                // Divide span into 10 vertical zones (top = 10 words, bottom = 1 word)
                let zone = 10 - Math.floor((mouseYRelativeToSpanTop / spanHeight) * 10);
                zone = Math.max(1, Math.min(zone, 10));
                let wordsToHighlight = zone;

                let currentSpan = target;
                for (let i = 0; i < wordsToHighlight - 1; i++) { // -1 because target already highlighted
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
                 // Mouse is over a text node (space or punctuation)
                 // Find immediate adjacent word spans and highlight them
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
             // If the target is the chatHistory div itself (e.g. padding area)
             // or another non-word/non-text node child, clear highlights.
        } else {
             // If mouse moves off an interactive element directly in chatHistory, clear highlights
             // This handles moving from a word/text node onto padding or out of the history area
             clearHighlights();
        }
    }

    // Handles mouse leaving the chat history area
    function handleMouseOut(event) {
        // Check if the mouse is actually leaving the chatHistory element
        // event.relatedTarget is the element the mouse is entering
        if (!event.relatedTarget || !chatHistory.contains(event.relatedTarget)) {
             clearHighlights();
        }
    }

    // Clears all currently highlighted word spans
    function clearHighlights() {
        currentlyHighlightedWords.forEach(span => {
            span.classList.remove('highlight-word');
        });
        currentlyHighlightedWords = []; // Reset the array
    }

    // Initial clear in case there's lingering data or highlights from a previous state
    clearHighlights();
    // subjectInput.value = ''; // Initial clear on page load if needed

});