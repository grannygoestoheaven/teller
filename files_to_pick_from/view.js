import { appState } from './state.js';
import { initTextStreamer, streamText, clearHighlights } from './textStreamer.js';
import { getRedColor } from './appearance/colors.js'; // Import the color function

export function initLoadingElements(container, animation, p1, p2, p3, ch) {
  loadingAnimationContainer = container;
  loadingAnimation = animation;
  period1 = p1;
  period2 = p2;
  period3 = p3;
  chatHistory = ch;
}

// Update UI based on the form's input state
export function formInputState(isInputEmpty) {
  if (!isInputEmpty) {
    playPauseButton.textContent = 'Play new story';
    playPauseButton.disabled = false;
    replayButton.disabled = true;
    stopButton.disabled = false;
  } else {
    // This will be handled by the updatePlayerUI function
    // that depends on playerState, not the form's content.
  }
}

  // Update text visibility state and trigger UI update
export function updateTextVisibility(booleanValue) {
  appState.isTextVisible = booleanValue;
  if (booleanValue) {
      showChatHistory();
  } else {
      hideChatHistory();
  }
}

export function displaySubject(subject) {
  // Display the subject in the UI
  storyTitle.value = subject;
}
  // Functions to control visual elements
export function showLoadingAnimation() {
  // Show the dot animation
  loadingAnimationContainer.style.display = 'flex';
  loadingAnimationContainer.classList.add('is-loading'); 
}
  
export function hideLoadingAnimation() {
  // Hide the dot animation
  loadingAnimationContainer.style.display = 'none';
  loadingAnimationContainer.classList.remove('is-loading');
  loadingAnimation.style.display = 'none'; // Hide the animation dots
}

export function showChatHistory() {
  // Make the chat history visible
  chatHistory.style.display = 'flex';
}

export function hideChatHistory() {
  // Make the chat history hidden
  chatHistory.style.display = 'none';
}

export function onTextDataReceived() {
  console.log("onReceivedData called");
  const container = document.getElementById('loadingAnimation')
  const color = getRedColor(); // generate a color
  container.style.setProperty("--period-color", color);
}
