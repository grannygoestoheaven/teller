import { elements } from config.js;

export function uiIdle() {
  // Clear past story
  elements.chatHistory.innerHTML = '';
  // Reset buttons
  elements.replayBtn.disabled = true;
  elements.playPauseBtn.disabled = true;
  elements.playPauseBtn.textContent = 'Play new Story';
}

export function initInputAdjustments() {
  const subjectInput = elements.formInput; // Get input from store
  const minHeight = subjectInput.clientHeight;
  const adjustInput = () => {
    subjectInput.style.overflow = 'hidden'
    subjectInput.style.height = 'auto';
    const h = Math.max(subjectInput.scrollHeight, minHeight);
    subjectInput.style.height = h + 'px';
  };
  
  subjectInput.addEventListener('input', adjustInput);
  adjustInput(); // initialize on load
}

export function inputNotEmpty() {
  // Access elements from the global store
  const formInput = elements.formInput;
  const replayButton = elements.replayButton;
  const playPauseButton = elements.playPauseButton;

  // The logic is now cleaner
  const isNotEmpty = formInput.value.trim().length > 0;
  
  if (replayButton) {
      replayButton.disabled = !isNotEmpty;
  }
  
  if (playPauseButton) {
      playPauseButton.disabled = !isNotEmpty;
      // Optional: Set text only when it becomes startable
      if (isNotEmpty) {
          playPauseButton.textContent = 'Start new story';
      }
  }
}

export function uiLoadingButtons() {
  elements.replayButton.disabled = true;
  elements.playPauseButton.disabled = true;
  elements.playPauseButton.textContent = 'Loading';
  elements.formInput.value = '';
  elements.style.display = 'none';
}

export function uiPlayingButtons() {
  elements.replayButton.disabled = false;
  elements.playPauseButton.disabled = false;
  elements.playPauseButton.textContent = 'Pause';
}

export function uiPausedButtons() {
  elements.replayButton.disabled = false;
  elements.playPauseButton.disabled = false;
  elements.playPauseButton.textContent = 'Resume';
}
