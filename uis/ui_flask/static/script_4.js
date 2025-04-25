document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('story-form');
    const loadingContainer = document.getElementById('loading-container');
    const chatHistory = document.getElementById('chatHistory');
    const generateButton = document.getElementById('generateButton');

    // Hide loading container on initial load
    loadingContainer.style.display = 'none';

    form.addEventListener('submit', function() {
        loadingContainer.style.display = 'flex';
        generateButton.disabled = true;
        chatHistory.innerHTML = '<div class="message system-message centered">Generating your story...</div>';
    });

    // Since it's a full page reload, the loading container will disappear
    // when the new page with the story is loaded.
});