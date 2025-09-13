export function uiIdle(chatHistory, playPauseBtn, replayBtn) {
  // Clear past story
  chatHistory.innerHTML = '';

  // Reset buttons
  replayBtn.disabled = true;
  playPauseBtn.disabled = true;
  playPauseBtn.textContent = 'Start new Story';
}

export function initInputAdjustments(subjectInput, minHeight = subjectInput.clientHeight) {
  const adjustInput = () => {
    subjectInput.style.overflow = 'hidden'
    subjectInput.style.height = 'auto';
    const h = Math.max(subjectInput.scrollHeight, minHeight);
    subjectInput.style.height = h + 'px';
  };
  
  subjectInput.addEventListener('input', adjustInput);
  adjustInput(); // initialize on load
}

// Update UI state based on the form's input
export function inputNotEmpty(playPauseBtn, replayBtn, stopBtn, formInput) {
  let inputNotEmpty = formInput.value.length > 0;
  if (inputNotEmpty) {
    playPauseBtn.textContent = 'Play new story';
    playPauseBtn.disabled = false;
    replayBtn.disabled = true;
    stopBtn.disabled = false;
  }
}
