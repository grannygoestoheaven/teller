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

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('story-form');
    const chatHistory = document.getElementById('chatHistory');
    const subjectInput = document.getElementById('subject');
    const generateButton = document.getElementById('generateButton');
    
    // Load saved story on page load
    const savedStory = loadStoryFromStorage();
    if (savedStory) {
        // Clear any existing content
        chatHistory.innerHTML = '';
        // Display the saved story immediately (no streaming)
        const storyDiv = document.createElement('div');
        storyDiv.className = 'story-content';
        // Replace newline characters with <br> for display
        storyDiv.innerHTML = savedStory.story.replace(/\n/g, '<br>');
        chatHistory.appendChild(storyDiv);
        // Don't modify the subject input to keep the placeholder
    }
    
    // Create audio context for sound effects
    let audioContext;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Web Audio API not supported in this browser');
    }
    
    // Function to play click sound (if needed, currently commented out in submit)
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
    
    // Available ambient tracks (not directly used in this JS snippet beyond definition)
    const ambientTracks = [
        { name: 'Ambient Track 1', color: 'rgba(100, 181, 246, 0.8)' },
        { name: 'Ambient Track 2', color: 'rgba(129, 199, 132, 0.8)' },
        { name: 'Ambient Track 3', color: 'rgba(255, 183, 77, 0.8)' },
        { name: 'No Track', color: 'rgba(255, 255, 255, 0.1)' }
    ];
    let currentTrackIndex = 0; // Not used in this snippet's logic
    let isGenerating = false;
    
    // Update subject display - now essentially a placeholder or can be removed
    function updateSubjectDisplay() {
        // This function is empty in your original code, retaining that behavior.
    }
    
    // Show/hide elements based on input focus (empty in original)
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

    let currentlyHighlightedWords = []; // Array to keep track of words currently highlighted by mousemove

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Ensure default submission is prevented

        if (isGenerating) { // If already generating, do nothing
            return;
        }
        isGenerating = true; // Set generating state
        generateButton.disabled = true; // Disable button immediately
        // playClickSound(); // Play click sound (uncomment if you want this)

        // Clear previous content from chat history
        chatHistory.innerHTML = '';
        
        // Show loading animation
        showLoadingAnimation();
        
        // Store the subject before clearing the form
        const subject = subjectInput.value.trim();
        
        // Clear the form (after storing the subject)
        subjectInput.value = '';

        // Show standby cursor - this will be replaced by streaming text
        const cursor = document.createElement('span');
        cursor.className = 'cursor-standby';
        chatHistory.appendChild(cursor);

        // Clear any previous highlights (important after content changes)
        clearHighlights();

        try {
            const formData = new FormData();
            // Explicitly add the subject to the form data
            formData.append('subject', subject);
            // Also add the length input
            formData.append('user_length_input', userLengthInput.value);
            
            const response = await fetch('/generate_story', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();

                // Load and play audio if available (assuming window.loadAndPlayTrack exists)
                if (data.audio_link && typeof window.loadAndPlayTrack === 'function') {
                    window.loadAndPlayTrack(data.audio_link, data.title || 'Generated Story');
                } else if (data.audio_link) {
                    console.warn('window.loadAndPlayTrack is not available, cannot play audio automatically.');
                }

                if (data.story) {
                    // Hide loading animation before streaming
                    hideLoadingAnimation();
                    chatHistory.innerHTML = ''; // Ensure it's clear before streaming
                    streamText(data.story, chatHistory);
                    
                    // Save the new story to localStorage
                    // Use the subject that was *sent* for the title, or a default
                    const storyTitle = subject || 'Untitled Story'; 
                    saveStoryToStorage(data.story, storyTitle);
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
            // Ensure loading animation is hidden even on error
            hideLoadingAnimation();
        }
    });

    // Function to stream text with typing effect and add interactivity
    async function streamText(text, container) {
        container.innerHTML = ''; // Clear container before streaming
        
        // Create a content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'story-content';
        container.appendChild(contentWrapper);
        
        const delay = 20; // Base delay in milliseconds (slightly faster)
        
        // Split text into paragraphs first
        const paragraphs = text.split('\n\n');
        
        for (let p = 0; p < paragraphs.length; p++) {
            const paragraph = paragraphs[p];
            if (!paragraph.trim()) continue; // Skip empty paragraphs
            
            // Create paragraph element
            const paragraphEl = document.createElement('p');
            paragraphEl.style.margin = '0.8em 0'; // Apply margin for paragraph spacing
            contentWrapper.appendChild(paragraphEl);
            
            // Process words in this paragraph
            // Split by words (\w+) or non-word/non-space characters ([^\w\s]) or spaces (\s+)
            const parts = paragraph.match(/(\w+|[^\w\s]|\s+)/g) || [];
            
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                let node;

                if (/\w+/.test(part)) { // If it's a word
                    node = document.createElement('span');
                    node.textContent = part;
                    node.classList.add('word'); // Add the 'word' class for highlighting
                    // No need for individual click listeners here due to event delegation
                } else { // If it's spaces or punctuation
                    node = document.createTextNode(part);
                }
                
                paragraphEl.appendChild(node);
                
                // Add a small delay for the typing effect
                if (i % 3 === 0) { // Only add delay every few characters for better performance
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            
            // Add a small delay between paragraphs
            if (p < paragraphs.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * 5));
            }
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

        // Attach mousemove and mouseout listeners to the chatHistory container itself
        // This is event delegation: listeners on parent, check target child.
        // It's crucial that these are attached AFTER content has been streamed.
        // If streamText can be called multiple times, ensure you remove previous
        // listeners before adding new ones to prevent multiple handlers.
        // For this single-stream-per-submit flow, it's fine.
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseout', handleMouseOut);
    }

    // Helper function to find the next *word* span (handling paragraphs)
    function findNextWordSpan(currentSpan) {
        let nextNode = currentSpan.nextSibling;
        // Search within the current paragraph first
        while (nextNode) {
            if (nextNode.nodeType === Node.ELEMENT_NODE && nextNode.classList.contains('word')) {
                return nextNode;
            }
            nextNode = nextNode.nextSibling;
        }

        // If no more words in current paragraph, check next paragraph (if exists)
        let currentParagraph = currentSpan.parentElement;
        if (currentParagraph && currentParagraph.nodeName === 'P') {
            let nextParagraph = currentParagraph.nextElementSibling;
            while (nextParagraph) {
                if (nextParagraph.nodeName === 'P') { // Ensure it's a paragraph element
                    const firstWordInNextParagraph = nextParagraph.querySelector('.word');
                    if (firstWordInNextParagraph) {
                        return firstWordInNextParagraph;
                    }
                }
                nextParagraph = nextParagraph.nextElementSibling;
            }
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
        // Always clear previous highlights at the start of every mousemove
        clearHighlights();

        const target = event.target;
        // Use .closest() to check if the target or any of its ancestors is a word
        const hoveredWordSpan = target.closest('.word');

        if (hoveredWordSpan) {
            // Mouse is over a word span (or inside one)
            const rect = hoveredWordSpan.getBoundingClientRect();
            const mouseYRelativeToSpanTop = event.clientY - rect.top;
            const spanHeight = rect.height;

            // Always highlight the current word
            hoveredWordSpan.classList.add('highlight-word');
            currentlyHighlightedWords.push(hoveredWordSpan);

            // Divide span into 10 vertical zones (top = 10 words, bottom = 1 word)
            let zone = 10 - Math.floor((mouseYRelativeToSpanTop / spanHeight) * 10);
            zone = Math.max(1, Math.min(zone, 10)); // Clamp between 1 and 10
            let wordsToHighlightCount = zone;

            let currentSpan = hoveredWordSpan;
            // Iterate to highlight subsequent words based on 'zone'
            for (let i = 0; i < wordsToHighlightCount - 1; i++) { // -1 because hoveredWordSpan is already highlighted
                const nextWord = findNextWordSpan(currentSpan);
                if (nextWord) {
                    nextWord.classList.add('highlight-word');
                    currentlyHighlightedWords.push(nextWord);
                    currentSpan = nextWord; // Move to the next word for the next iteration
                } else {
                    break; // No more words to highlight
                }
            }
        }
        // If not hovering over a word, clearHighlights() already took care of it.
    }

    // Handles mouse leaving the chat history area (or any word within it)
    function handleMouseOut(event) {
        // Only clear highlights if the mouse is actually leaving the chatHistory container itself
        // or moving from a word to a non-word element *outside* the chatHistory's content area
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

    // Use event delegation for word clicks on the chatHistory container
    chatHistory.addEventListener('click', function(event) {
        const wordSpan = event.target.closest('.word');
        if (wordSpan) {
            // Call handleWordClick with the identified word span
            handleWordClick({ target: wordSpan });
        }
    });
    
    // Initial clear in case there's lingering data or highlights from a previous state
    clearHighlights();
    
    // Make sure the subject input is focused when the page loads
    if (subjectInput.value === '') {
        subjectInput.focus();
    }
});