document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('story-form');
    const loadingContainer = document.getElementById('loading-container');
    const chatHistory = document.getElementById('chatHistory');
    const generateButton = document.getElementById('generateButton');
    const subjectInput = document.getElementById('subject'); // Get the subject input

    // Hide loading container on initial load
    loadingContainer.style.display = 'none';

    // Store references to currently highlighted word spans for efficient clearing
    let currentlyHighlightedWords = [];

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        loadingContainer.style.display = 'flex';
        generateButton.disabled = true;

        // Clear previous content
        chatHistory.innerHTML = '';

        // Show standby cursor (might be immediately replaced by streamed words)
        const cursor = document.createElement('span');
        cursor.className = 'cursor-standby';
        chatHistory.appendChild(cursor);

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
                    // Pass the story text to the modified streamText function
                    await streamText(data.story, chatHistory);
                }
            } else {
                throw new Error('Failed to generate story');
            }
        } catch (error) {
            console.error('Error:', error);
            chatHistory.innerHTML = '<div class="message error">Error generating story. Please try again.</div>';
            // Remove cursor if it's still there
             const existingCursor = chatHistory.querySelector('.cursor-standby');
             if (existingCursor) {
                 existingCursor.remove();
             }

        } finally {
            loadingContainer.style.display = 'none';
            generateButton.disabled = false;
        }
    });

    // Function to stream text with typing effect and add interactivity
    async function streamText(text, container) {
        container.innerHTML = ''; // Clear container
        const delay = 20; // Base delay in milliseconds (slightly faster)

        // Regex to split words, spaces, and punctuation separately
        // const parts = text.match(/(\w+|[^\w\s]|\s+)/g);
        // const parts = text.match(/(\w+(?:'s)?|[^\w\s]|\s+)/g);
        const parts = text.match(/(\w+'s|\w+|[^\w\s]|\s+)/g);

        if (!parts) return; // Handle empty text

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            let node;

            if (/\w+/.test(part)) { // If it's a word
node = document.createElement('span');                                              
                node.textContent = part;
                node.classList.add('word'); // Add a class to identify word spans

                // Add click listener to toggle word in subject input
                node.addEventListener('click', handleWordClick);

            } else if (/\s+/.test(part)) { // If it's one or more spaces
                node = document.createTextNode(part);
                // Optional: wrap spaces in a span if you need to target them specifically
                // node = document.createElement('span');
                // node.textContent = part;
                // node.classList.add('space');
            } else { // If it's punctuation
                 node = document.createTextNode(part);
                // Optional: wrap punctuation in a span
                // node = document.createElement('span');
                // node.textContent = part;
                // node.classList.add('punctuation');
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

        // Attach mousemove and mouseout listeners to the container after streaming
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseout', handleMouseOut);
    }

    // Handles clicking on a word span in the chat history
    function handleWordClick(event) {
        const clickedWordSpan = event.target;
        const clickedWord = clickedWordSpan.textContent.trim();

        // Get current words in the subject input, split by space and filter empty
        let subjectWords = subjectInput.value.trim().split(/\s+/).filter(word => word.length > 0);

        const wordIndex = subjectWords.indexOf(clickedWord);

        if (wordIndex > -1) {
            // Word is already in subject, remove it
            subjectWords.splice(wordIndex, 1);
        } else {
            // Word is not in subject, add it
            subjectWords.push(clickedWord);
        }

        // Update the subject input value
        subjectInput.value = subjectWords.join(' ');
    }

    // Handles mouse movement for highlighting
    function handleMouseMove(event) {
        const target = event.target;
        const parent = target.parentElement;

        // Check if the mouse is over a word span or a text node within chatHistory
        if (parent === chatHistory) {
            // Clear previous highlights
            clearHighlights();

            if (target.classList && target.classList.contains('word')) {
                // Mouse is over a word span, highlight it
                target.classList.add('highlight-word');
                currentlyHighlightedWords.push(target);
            } else if (target.nodeType === Node.TEXT_NODE) {
                // Mouse is over a text node (space or punctuation)
                // Find adjacent word spans
                let prevElement = target.previousElementSibling;
                let nextElement = target.nextElementSibling;

                // Check if previous element is a word span
                if (prevElement && prevElement.classList.contains('word')) {
                    prevElement.classList.add('highlight-word');
                    currentlyHighlightedWords.push(prevElement);
                }

                // Check if next element is a word span
                if (nextElement && nextElement.classList.contains('word')) {
                    nextElement.classList.add('highlight-word');
                    currentlyHighlightedWords.push(nextElement);
                }
            }
        } else {
             // If mouse moves off a word/space/punctuation directly in chatHistory, clear highlights
             // This handles cases where the mouse might be over the padding of chatHistory
             clearHighlights();
        }
    }

    // Handles mouse leaving the chat history area
    function handleMouseOut() {
        clearHighlights();
    }

    // Clears all currently highlighted word spans
    function clearHighlights() {
        currentlyHighlightedWords.forEach(span => {
            span.classList.remove('highlight-word');
        });
        currentlyHighlightedWords = []; // Reset the array
    }

});