document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('story-form');
    const loadingContainer = document.getElementById('loading-container');
    const chatHistory = document.getElementById('chatHistory');
    const generateButton = document.getElementById('generateButton');
    let selectedWord = '';

    // Hide loading container on initial load
    loadingContainer.style.display = 'none';

    // Create standby cursor
    const standbyCursor = document.createElement('span');
    standbyCursor.className = 'cursor-standby';
    chatHistory.appendChild(standbyCursor);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        loadingContainer.style.display = 'flex';
        generateButton.disabled = true;
        
        // Clear previous content
        chatHistory.innerHTML = '';
        
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
        } finally {
            loadingContainer.style.display = 'none';
            generateButton.disabled = false;
        }
    });

    // Function to stream text with typing effect
    async function streamText(text, container) {
        container.innerHTML = '';
        const words = text.split(' ');
        let currentText = '';
        
        for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            container.textContent = currentText;
            
            // Add cursor at the end
            const cursor = document.createElement('span');
            cursor.className = 'cursor-standby';
            container.appendChild(cursor);
            
            // Random typing speed between 30-100ms
            await new Promise(resolve => setTimeout(resolve, Math.random() * 70 + 30));
            
            // Remove cursor before adding next word
            if (cursor.parentNode) {
                cursor.remove();
            }
        }
        
        // Add final cursor
        const finalCursor = document.createElement('span');
        finalCursor.className = 'cursor-standby';
        container.appendChild(finalCursor);
    }
});