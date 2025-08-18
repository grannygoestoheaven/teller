// Update UI based on the form's state
export function updateFormUI(state) {
    if (state.formIsNotEmpty) {
      playPauseButton.textContent = 'Play new story';
      playPauseButton.disabled = false;
      replayButton.disabled = true;
    } else {
      // This will be handled by the updatePlayerUI function
      // that depends on playerState, not the form's content.
    }
  }

  // Update UI based on the player's state
export function updatePlayerUI(state) {
    if (state.playerState === 'idle') {
      // Reset buttons, hide chat history, hide animation.
      playPauseButton.textContent = 'Play new story';
      playPauseButton.disabled = true;
      replayButton.disabled = true;
      hideLoadingAnimation();
      hideChatHistory();
    } else if (state.playerState === 'loading') {
      showLoadingAnimation();
      playPauseButton.disabled = true;
      replayButton.disabled = true;
    } else if (state.playerState === 'ready') {
      // The player is loaded and ready, but not playing yet.
      playPauseButton.textContent = 'Pause';
      playPauseButton.disabled = false;
      replayButton.disabled = false;
    } else if (state.playerState === 'playing') {
      playPauseButton.textContent = 'Pause';
      playPauseButton.disabled = false;
      replayButton.disabled = false;
    } else if (state.playerState === 'paused') {
      playPauseButton.textContent = 'Resume';
      playPauseButton.disabled = false;
      replayButton.disabled = false;
    } else if (state.playerState === 'ended') {
      // Speech is over. Background audio may still be playing.
      playPauseButton.textContent = 'Pause';
      replayButton.disabled = false;
      hideLoadingAnimation();
      showChatHistory();
    }
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