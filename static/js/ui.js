export function uiIdle(chatHistory, replayBtn, playPauseBtn) {
  // Clear past story
  chatHistory.innerHTML = '';
  // Reset buttons
  replayBtn.disabled = true;
  playPauseBtn.disabled = true;
  playPauseBtn.textContent = 'Play new Story';
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

// // Update UI state based on the form's input
// export function inputNotEmpty(playPauseBtn, replayBtn, stopBtn, formInput) {
//   let inputNotEmpty = formInput.value.length > 0;
//   if (inputNotEmpty) {
//     playPauseBtn.textContent = 'Start new story';
//     playPauseBtn.disabled = false;
//     replayBtn.disabled = true;
//     stopBtn.disabled = false;
//   }
// }

export function inputNotEmpty(playPauseBtn, replayBtn, stopBtn, formInput) {
  const isNotEmpty = formInput.value.trim().length > 0;
  if (replayBtn) {
      replayBtn.disabled = !isNotEmpty;
  }
  // Now, also handle the playPauseBtn
  if (playPauseBtn) {
      playPauseBtn.disabled = !isNotEmpty;
  }
}

export function uiLoadingButtons() {
  playPauseBtn.textContent = 'Pause';
  playPauseBtn.disabled = true;
}

export function uiPlayingButtons() {
  playPauseBtn.disabled = false;
}
