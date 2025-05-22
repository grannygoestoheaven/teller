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

    // Available ambient tracks (keeping this for context, though not directly modified)
    const ambientTracks = [
        { name: 'Ambient Track 1', color: 'rgba(100, 181, 246, 0.8)' },
        { name: 'Ambient Track 2', color: 'rgba(129, 199, 132, 0.8)' },
        { name: 'Ambient Track 3', color: 'rgba(255, 183, 77, 0.8)' },
        { name: 'No Track', color: 'rgba(255, 255, 255, 0.1)' }
    ];
    let currentTrackIndex = 0;
    let isGenerating = false;

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
    let loadingAnimationInterval; // To store the interval for clearing later

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Ensure default submission is prevented

        if (isGenerating) { // If already generating, do nothing
            return;
        }
        isGenerating = true; // Set generating state
        generateButton.disabled = true; // Disable button immediately
        playClickSound(); // Play click sound

        // 1. Clear subject input immediately
        subjectInput.value = '';

        // Clear previous content from chat history
        chatHistory.innerHTML = '';

        // 2. Show loading animation
        showLoadingAnimation();

        // Clear any previous highlights
        clearHighlights();

        try {
            const formData = new FormData(form);
            const response = await fetch('/generate_story', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                if (data.story) {
                    await streamText(data.story, chatHistory);
                } else {
                    chatHistory.innerHTML = '<div class="message error">Generated response is missing story text.</div>';
                }
            } else {
                const errorText = await response.text();
                throw new Error(`Server responded with status ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            chatHistory.innerHTML = `<div class="message error">Error generating story: ${error.message}. Please try again.</div>`;
        } finally {
            isGenerating = false; // Reset generating state
            generateButton.disabled = false; // Re-enable button
            // 3. Hide loading animation when done (success or error)
            hideLoadingAnimation();
        }
    });

    // Function to show the loading animation
    function showLoadingAnimation() {
        chatHistory.innerHTML = ''; // Clear previous content

        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-animation';
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
            loadingDiv.remove();
        }
    }


    // Function to stream text with typing effect and add interactivity
    async function streamText(text, container) {
        container.innerHTML = ''; // Clear container before streaming
        const delay = 20; // Base delay in milliseconds (slightly faster)

        // Regex to split words, spaces, and punctuation separately
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

                node.addEventListener('click', handleWordClick);

            } else { // If it's spaces or punctuation
                 node = document.createTextNode(part);
            }

            container.appendChild(node); // Add the node to the container

            await new Promise(resolve => setTimeout(resolve, delay));
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
        currentlyHighlightedWords = []; // Reset the array
    }

    clearHighlights();
});