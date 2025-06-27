import { restartSpeech, togglePlayPauseSpeech, updatePlayPauseIcon } from './audioControls.js';

let loadingAnimationContainer;
let loadingAnimation;
let period1;
let period2;
let period3;
let chatHistory; // Need to know chatHistory for text visibility
let storyTextShadowTimeoutId = null; // From main logic, moved here for clarity in text visibility

export function initLoadingElements(container, animation, p1, p2, p3, ch) {
    loadingAnimationContainer = container;
    loadingAnimation = animation;
    period1 = p1;
    period2 = p2;
    period3 = p3;
    chatHistory = ch;
}

// Function to show the loading animation
export function showLoadingAnimation() {
    chatHistory.innerHTML = ''; // Clear chat history content
    loadingAnimationContainer.style.display = 'flex'; // Show the container
    loadingAnimation.style.display = 'flex'; // Show the animation dots themselves

    // Reset dot classes to ensure animation plays again
    period1.className = 'period period-1';
    period2.className = 'period period-2';
    period3.className = 'period period-3';

    // Remove any interactive listeners that might be lingering
    period1.onclick = null;
    period2.onclick = null;
    period3.onclick = null;
}

// Function to hide the loading animation and transform dots
export function hideLoadingAnimation() {
    // Ensure the loading animation dots themselves are displayed when transforming
    // The container needs to be visible to show the transformed controls
    loadingAnimation.style.display = 'flex';
    loadingAnimationContainer.style.display = 'flex';

    // Transform dots into interactive controls
    transformDotsIntoControls();
}

function transformDotsIntoControls() {
    // Remove animation classes and add interactive ones for each period
    period1.classList.remove('period-1');
    period1.classList.add('interactive', 'control-restart');
    period1.textContent = '⟲'; // Unicode restart icon
    period1.onclick = () => restartSpeech();

    period2.classList.remove('period-2');
    period2.classList.add('interactive', 'control-play');
    updatePlayPauseIcon(); // Set initial icon based on speech state
    period2.onclick = () => togglePlayPauseSpeech();

    period3.classList.remove('period-3');
    period3.classList.add('interactive', 'control-toggle-text');
    period3.textContent = '👁️‍🗨️'; // Default: text is shadowed, so toggle button implies "show"
    period3.onclick = () => toggleStoryTextVisibility();

    // Optional: Hide actual story-title-display if we're not using it directly
    document.getElementById('story-title-display').style.display = 'none';
}

// --- NEW: Text Visibility Toggle Function ---
let isTextFullyVisible = false; // Default state after initial shadow fade
export function toggleStoryTextVisibility() {
    // Ensure chatHistory exists and has content before trying to toggle classes
    if (!chatHistory || chatHistory.innerHTML.trim() === '') return;

    isTextFullyVisible = !isTextFullyVisible;
    if (isTextFullyVisible) {
        chatHistory.classList.remove('text-shadow');
        chatHistory.classList.add('text-full');
        period3.textContent = '👁️'; // Eye icon: text is shown, so button indicates "hide"
    } else {
        chatHistory.classList.remove('text-full');
        chatHistory.classList.add('text-shadow');
        period3.textContent = '👁️‍🗨️'; // Eye with slash: text is shadowed, so button indicates "show"
    }
}

// Expose the timeout ID so main can clear it
export function setStoryTextShadowTimeout(timeoutId) {
    storyTextShadowTimeoutId = timeoutId;
}

export function clearStoryTextShadowTimeout() {
    if (storyTextShadowTimeoutId) clearTimeout(storyTextShadowTimeoutId);
}