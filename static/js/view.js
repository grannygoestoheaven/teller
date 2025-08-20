import { showLoadingAnimation } from "./views";

// Update UI based on the form's state
export function updateFormState(formState) {
    if (formState.formIsNotEmpty) {
      playPauseButton.textContent = 'Play new story';
      playPauseButton.disabled = false;
      replayButton.disabled = true;
      formInput.disabled = true;
      stopButton.disabled = false;
    } else {
      // This will be handled by the updatePlayerUI function
      // that depends on playerState, not the form's content.
    }
  }

// Update UI based on the player's state
export function updatePlayerUI(playerState) {
    if (playerState === 'idle') {
      // Reset buttons, hide chat history, hide animation.
      playPauseButton.textContent = 'Play new story';
      playPauseButton.disabled = true;
      replayButton.disabled = true;
      hideLoadingAnimation();
      hideChatHistory();
    } else if (playerState === 'loading') {
      showLoadingAnimation();
      playPauseButton.disabled = true;
      replayButton.disabled = true;
    } else if (playerState === 'ready') {
      // The player is loaded and ready, but not playing yet.
      playPauseButton.textContent = 'Pause';
      playPauseButton.disabled = false;
      replayButton.disabled = false;
    } else if (playerState === 'playing') {
      playPauseButton.textContent = 'Pause';
      playPauseButton.disabled = false;
      replayButton.disabled = false;
    } else if (playerState === 'paused') {
      playPauseButton.textContent = 'Resume';
      playPauseButton.disabled = false;
      replayButton.disabled = false;
    } else if (playerState === 'ended') {
      // Speech is over. Background audio may still be playing.
      playPauseButton.textContent = 'Pause';
      replayButton.disabled = false;
      hideLoadingAnimation();
      showChatHistory();
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
}

export function showChatHistory() {
  // Make the chat history visible
}

export function hideChatHistory() {
  // Make the chat history hidden
}