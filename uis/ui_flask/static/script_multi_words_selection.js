document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('story-form');
    const loadingContainer = document.getElementById('loading-container');
    const chatHistory = document.getElementById('chatHistory');
    const generateButton = document.getElementById('generateButton');
    const subjectInput = document.getElementById('subject');

    // --- Sound Initialization ---
    const hoverSound = new Audio('/static/sounds/hover_sound.mp3'); // Adjust path
    hoverSound.preload = 'auto';
    // --- End Sound Initialization ---

    // --- Selection Management ---
    const selectedWords = new Set(); // Use a Set to store selected words/phrases
    // --- End Selection Management ---

    // Hide loading container on initial load
    loadingContainer.style.display = 'none';

    // Initial standby cursor (might be immediately replaced by streamed words)
    const standbyCursor = document.createElement('span');
    standbyCursor.className = 'cursor-standby';
    chatHistory.appendChild(standbyCursor);


    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        loadingContainer.style.display = 'flex';
        generateButton.disabled = true;

        // Clear previous content and selections
        chatHistory.innerHTML = '';
        selectedWords.clear(); // Clear selected words on new generation
        updateSubjectInput(); // Clear the input field
        subjectInput.value = ''; // Ensure input is empty

        // Show standby cursor
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
                    await streamText(data.story, chatHistory);
                }
            } else {
                throw new Error('Failed to generate story');
            }
        } catch (error) {
            console.error('Error:', error);
            chatHistory.innerHTML = '<div class="message error">Error generating story. Please try again.</div>';
             const existingCursor = chatHistory.querySelector('.cursor-standby');
             if (existingCursor) {
                 existingCursor.remove();
             }

        } finally {
            loadingContainer.style.display = 'none';
            generateButton.disabled = false;
        }
    });

    // Function to update the subject input based on selectedWords Set
    function updateSubjectInput() {
        // Join words with a space. Set maintains insertion order in modern JS.
        subjectInput.value = Array.from(selectedWords).join(' ');
    }

    // Function to clean punctuation from a word
    function cleanWord(word) {
        // Remove punctuation from the end of the word
        return word.replace(/[.,!?;:]+$/, '');
    }

    // Function to stream text with typing effect and add interactivity
    async function streamText(text, container) {
        container.innerHTML = ''; // Clear container
        // Split by whitespace, but keep punctuation attached to words initially
        const words = text.split(/\s+/);
        const delay = 50; // Base delay in milliseconds

        for (let i = 0; i < words.length; i++) {
            const wordText = words[i];
            const wordSpan = document.createElement('span');
            wordSpan.textContent = wordText; // Store original text with punctuation

            // Add interactivity events
            wordSpan.addEventListener('mouseenter', () => {
                 wordSpan.classList.add('highlight-word');
                 // Play sound
                 hoverSound.currentTime = 0;
                 hoverSound.play().catch(e => {/* console.warn("Audio blocked:", e); */});
             });

            wordSpan.addEventListener('mouseleave', () => {
                 wordSpan.classList.remove('highlight-word');
             });

            wordSpan.addEventListener('click', () => {
                const cleaned = cleanWord(wordText); // Get cleaned word text
                if (cleaned) { // Only add/remove if not empty after cleaning
                    if (selectedWords.has(cleaned)) {
                        selectedWords.delete(cleaned);
                        wordSpan.classList.remove('selected-word');
                    } else {
                        selectedWords.add(cleaned);
                        wordSpan.classList.add('selected-word');
                    }
                    updateSubjectInput(); // Update input field
                }
            });

            container.appendChild(wordSpan); // Add the word span

            // Add a space span after the word, unless it's the last word
            if (i < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.textContent = ' '; // The space character
                spaceSpan.classList.add('word-space'); // Class for space spans

                // Highlight adjacent words when hovering the space
                spaceSpan.addEventListener('mouseenter', () => {
                    const prevWord = spaceSpan.previousElementSibling;
                    const nextWord = spaceSpan.nextElementSibling;
                    if (prevWord && prevWord.tagName === 'SPAN' && !prevWord.classList.contains('word-space')) {
                        prevWord.classList.add('highlight-word');
                    }
                     if (nextWord && nextWord.tagName === 'SPAN' && !nextWord.classList.contains('word-space')) {
                        nextWord.classList.add('highlight-word');
                    }
                    // Optional: play sound when hovering space too
                    // hoverSound.currentTime = 0;
                    // hoverSound.play().catch(e => {});
                });

                spaceSpan.addEventListener('mouseleave', () => {
                    const prevWord = spaceSpan.previousElementSibling;
                    const nextWord = spaceSpan.nextElementSibling;
                     if (prevWord && prevWord.tagName === 'SPAN' && !prevWord.classList.contains('word-space')) {
                        prevWord.classList.remove('highlight-word');
                    }
                     if (nextWord && nextWord.tagName === 'SPAN' && !nextWord.classList.contains('word-space')) {
                        nextWord.classList.remove('highlight-word');
                    }
                });

                 // Click on space could potentially join adjacent words or do nothing
                 // For now, let's not make space clickable for selection

                container.appendChild(spaceSpan); // Add the space span
            }

            // Introduce a small delay for the typing effect
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Remove the initial standby cursor
         const existingCursor = container.querySelector('.cursor-standby');
         if (existingCursor) {
             existingCursor.remove();
         }
    }
});