document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('story-form');
    const loadingContainer = document.getElementById('loading-container');
    const chatHistory = document.getElementById('chatHistory');
    const subjectInput = document.getElementById('subject'); // Get the subject input
    const generateButton = document.getElementById('generateButton');

    // Hide loading container on initial load
    loadingContainer.style.display = 'none';

    // Store references to currently highlighted word spans for efficient clearing
    let currentlyHighlightedWords = [];

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission

        // Show loading animation immediately
        loadingContainer.style.display = 'flex';
        generateButton.disabled = true;

        // Clear previous content from chat history but NOT subject input yet
        chatHistory.innerHTML = '';

        // Show standby cursor (might be immediately replaced by streamed words)
        const cursor = document.createElement('span');
        cursor.className = 'cursor-standby';
        chatHistory.appendChild(cursor);

        // Clear any previous highlights
        clearHighlights();
        // Subject input clearing moved to AFTER streaming

        try {
            const formData = new FormData(form);
            const response = await fetch('/generate_story', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                if (data.story) {
                    // Pass the story text to the modified streamText function
                    await streamText(data.story, chatHistory);
                    // **Clear subject input AFTER streaming is complete**
                    subjectInput.value = '';
                } else {
                     // Handle case where response is OK but has no story field
                     chatHistory.innerHTML = '<div class="message error">Generated response is missing story text.</div>';
                }
            } else {
                 // Handle HTTP errors
                const errorText = await response.text(); // Try to get error details
                throw new Error(`Server responded with status ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            chatHistory.innerHTML = `<div class="message error">Error generating story: ${error.message}. Please try again.</div>`;
            // Remove cursor if it's still there on error
             const existingCursor = chatHistory.querySelector('.cursor-standby');
             if (existingCursor) {
                 existingCursor.remove();
             }

        } finally {
            // Hide loading animation and re-enable button regardless of success or failure
            loadingContainer.style.display = 'none';
            generateButton.disabled = false;
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