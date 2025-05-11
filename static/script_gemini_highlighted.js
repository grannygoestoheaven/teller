document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('story-form');
    const loadingContainer = document.getElementById('loading-container');
    const chatHistory = document.getElementById('chatHistory');
    const generateButton = document.getElementById('generateButton');
    const subjectInput = document.getElementById('subject'); // Get the subject input

    // Hide loading container on initial load
    loadingContainer.style.display = 'none';

    // Note: The standby cursor logic might need adjustment depending on how
    // text is displayed. If streaming word by word in spans, the cursor
    // logic as written might be less relevant or need re-implementation
    // within the streaming loop if you still want a typing cursor effect.
    // For now, let's keep the original cursor logic but note it might behave differently.

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
        const words = text.split(/\s+/); // Split by one or more whitespace characters
        const delay = 50; // Base delay in milliseconds

        for (let i = 0; i < words.length; i++) {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = words[i]; // Set the word text

            // Add hover effect class on mouseover
            wordSpan.addEventListener('mouseover', () => {
                wordSpan.classList.add('highlight-word');
            });

            // Remove hover effect class on mouseout
            wordSpan.addEventListener('mouseout', () => {
                wordSpan.classList.remove('highlight-word');
            });

            // Add click listener to set subject input
            wordSpan.addEventListener('click', () => {
                // Use textContent to get the word without potential extra spaces
                subjectInput.value = wordSpan.textContent.trim();
            });

            container.appendChild(wordSpan); // Add the word span

            // Add a space after the word, unless it's the last word
            if (i < words.length - 1) {
                const spaceNode = document.createTextNode(' ');
                container.appendChild(spaceNode);
            }

            // Introduce a small delay for the typing effect
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Remove the initial standby cursor if it's still there after streaming
         const existingCursor = container.querySelector('.cursor-standby');
         if (existingCursor) {
             existingCursor.remove();
         }

        // If you still want a cursor *after* the text, you'd add it here:
        // const finalCursor = document.createElement('span');
        // finalCursor.className = 'cursor-standby'; // Style this in CSS to blink
        // container.appendChild(finalCursor);

    }
});