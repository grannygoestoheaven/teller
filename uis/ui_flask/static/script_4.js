document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('story-form');
    const loadingContainer = document.getElementById('loading-container');
    const chatHistory = document.getElementById('chatHistory');
    const generateButton = document.getElementById('generateButton');
    let selectedWord = '';

    // Hide loading container on initial load
    loadingContainer.style.display = 'none';

    form.addEventListener('submit', function() {
        loadingContainer.style.display = 'flex';
        generateButton.disabled = true;
        chatHistory.innerHTML = '<div class="message system-message centered">Generating your story...</div>';
    });

    // Process story text to make words interactive
    function makeWordsInteractive() {
        const storyParagraphs = document.querySelectorAll('.ai-message p:not(:first-child)');
        
        storyParagraphs.forEach(p => {
            const text = p.textContent;
            const words = text.split(/(\s+)/);
            
            p.innerHTML = words.map(word => {
                // Skip empty strings and pure whitespace
                if (!word.trim()) return word;
                return `<span class="word">${word}</span>`;
            }).join('');
        });

        // Add event listeners to all word spans
        document.querySelectorAll('.word').forEach(wordSpan => {
            wordSpan.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f0f0f0';
                this.style.padding = '2px 4px';
                this.style.borderRadius = '4px';
                this.style.transition = 'all 0.2s ease';
                this.style.transform = 'scale(1.1)';
                this.style.display = 'inline-block';
                this.style.cursor = 'pointer';
            });

            wordSpan.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
                this.style.transform = '';
                this.style.padding = '';
                this.style.borderRadius = '';
            });

            wordSpan.addEventListener('click', function() {
                // Remove highlight from previously selected word
                document.querySelectorAll('.word.selected').forEach(w => {
                    w.classList.remove('selected');
                });
                
                // Highlight newly selected word
                this.classList.add('selected');
                
                // Store the selected word (without any HTML tags if present)
                selectedWord = this.textContent.trim();
                console.log('Selected word:', selectedWord);
                
                // You can use the selectedWord variable as needed
                // For example, you could store it in a global variable or send it to a function
            });
        });
    }


    // Check for story content and make it interactive
    const checkForStory = setInterval(() => {
        const storyContent = document.querySelector('.ai-message p:not(:first-child)');
        if (storyContent) {
            clearInterval(checkForStory);
            makeWordsInteractive();
        }
    }, 500);
});