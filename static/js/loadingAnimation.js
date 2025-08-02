// import { restartSpeech, togglePlayPauseSpeech, updatePlayPauseIcon } from './audioControls.js';

// let loadingAnimationContainer;
// let loadingAnimation;
// let period1;
// let period2;
// let period3;
// let chatHistory; // Need to know chatHistory for text visibility
// let storyTextShadowTimeoutId = null; // From main logic, moved here for clarity in text visibility

// export function initLoadingElements(container, animation, p1, p2, p3, ch) {
//     loadingAnimationContainer = container;
//     loadingAnimation = animation;
//     period1 = p1;
//     period2 = p2;
//     period3 = p3;
//     chatHistory = ch;
// }

// // Function to show the loading animation
// export function showLoadingAnimation() {
//     chatHistory.innerHTML = ''; // Clear chat history content
//     loadingAnimationContainer.style.display = 'flex'; // Show the container
//     loadingAnimation.style.display = 'flex'; // Show the animation dots themselves

//     // Reset dot classes to ensure animation plays again
//     period1.className = 'period period-1';
//     period2.className = 'period period-2';
//     period3.className = 'period period-3';

//     // Remove any interactive listeners that might be lingering
//     period1.onclick = null;
//     period2.onclick = null;
//     period3.onclick = null;
// }

// // Function to hide the loading animation and transform dots
// export function hideLoadingAnimation() {
//     // Ensure the loading animation dots themselves are displayed when transforming
//     // The container needs to be visible to show the transformed controls
//     loadingAnimation.style.display = 'flex';
//     loadingAnimationContainer.style.display = 'flex';

//     // Transform dots into interactive controls
//     // transformDotsIntoControls();
// }

// // --- NEW: Text Visibility Toggle Function ---
// let isTextFullyVisible = false; // Default state after initial shadow fade
// export function toggleStoryTextVisibility() {
//     // Ensure chatHistory exists and has content before trying to toggle classes
//     if (!chatHistory || chatHistory.innerHTML.trim() === '') return;

//     isTextFullyVisible = !isTextFullyVisible;
//     if (isTextFullyVisible) {
//         chatHistory.classList.remove('text-shadow');
//         chatHistory.classList.add('text-full');
//     } else {
//         chatHistory.classList.remove('text-full');
//         chatHistory.classList.add('text-shadow');
//     }
// }

// // Expose the timeout ID so main can clear it
// export function setStoryTextShadowTimeout(timeoutId) {
//     storyTextShadowTimeoutId = timeoutId;
// }

// export function clearStoryTextShadowTimeout() {
//     if (storyTextShadowTimeoutId) clearTimeout(storyTextShadowTimeoutId);
// }

// import { restartSpeech, togglePlayPauseSpeech, updatePlayPauseIcon } from './audioControls.js'; // Not needed here, remove this line

let loadingAnimationContainer;
let loadingAnimation;
let period1;
let period2;
let period3;
let chatHistory; // Still need chatHistory to clear its content

// storyTextShadowTimeoutId is no longer needed as we're not using shadow
// let storyTextShadowTimeoutId = null; 

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

// Function to hide the loading animation
export function hideLoadingAnimation() {
    loadingAnimationContainer.style.display = 'none'; // Hide the entire container
    loadingAnimation.style.display = 'none'; // Hide the animation dots
    // No longer transforming dots into controls directly in this module
}

// --- NEW: Text Visibility Toggle Function (Removed/Simplified) ---
// Since text will always be fully visible, this function is no longer needed
// export function toggleStoryTextVisibility() { /* ... */ }

// Expose the timeout ID so main can clear it (No longer needed)
// export function setStoryTextShadowTimeout(timeoutId) { /* ... */ }

// export function clearStoryTextShadowTimeout() { /* ... */ }

export function getColor() {
    // Example: random color
    const letters = "0123456789ABCDEF";
    let color = "#";
    for(let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  export function onTextDataReceived() {
    console.log("onReceivedData called");
    const container = document.getElementById('loadingAnimation')
    const color = getColor(); // generate a color
    container.style.setProperty("--period-color", color);
  }