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
  const replayBtn = elements.replayBtn;
  const playPauseBtn = elements.playPauseBtn;

  // The logic is now cleaner
  const isNotEmpty = formInput.value.trim().length > 0;
  
  if (replayBtn) {
      replayBtn.disabled = !isNotEmpty;
  }
  
  if (playPauseBtn) {
      playPauseBtn.disabled = !isNotEmpty;
      // Optional: Set text only when it becomes startable
      if (isNotEmpty) {
          playPauseBtn.textContent = 'Start new story';
      }
  }
}

export function uiLoadingButtons() {
  elements.replayBtn.disabled = true;
  elements.playPauseBtn.disabled = true;
  elements.playPauseBtn.textContent = 'Loading';
}

export function uiPlayingButtons() {
  elements.replayBtn.disabled = false;
  elements.playPauseBtn.disabled = false;
  elements.playPauseBtn.textContent = 'Pause';
}

export function uiPausedButtons() {
  elements.replayBtn.disabled = false;
  elements.playPauseBtn.disabled = false;
  elements.playPauseBtn.textContent = 'Resume';
}