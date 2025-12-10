import { elements } from './config.js';

export function events(sm) {
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
      event.preventDefault();
      sm.dispatchEvent(AudioStateMachine.EventId.TOGGLE_PAUSE_RESUME); // leads to PAUSED state or PLAYING (resumed) state
    }
  });

  elements.playPauseButton?.addEventListener("click", () => {
    console.log('Play/Pause clicked');
    sm.dispatchEvent(AudioStateMachine.EventId.TOGGLE_PAUSE_RESUME); // leads to PLAYING state or PAUSED state
  });

  elements.stopButton?.addEventListener("click", () => {
    console.log("Stop clicked")
    sm.dispatchEvent(AudioStateMachine.EventId.CANCEL); // Leads to IDLE state
  })

  elements.formInput?.addEventListener('input', () => {
    console.log('Form input changed');
    sm.dispatchEvent(AudioStateMachine.EventId.INPUT_CHANGED); // leads to READY state
  });

  elements.form?.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log('Form submitted');
    sm.dispatchEvent(AudioStateMachine.EventId.FORM_SUBMITTED) // leads to LOADING state
  });

  elements.chatHistoryContainer?.addEventListener('click', () => {
    console.log('Chat history clicked');
    sm.dispatchEvent(AudioStateMachine.EventId.CHAT_HISTORY_CLICKED); // leads to TEXT_DISPLAYED internal event
  });

  elements.speech?.addEventListener('canplaythrough', () => {
    console.log('Audio ready to play');
    sm.dispatchEvent(AudioStateMachine.EventId.SPEECH_READY); // leads to PLAYING state
  });

  elements.speech?.addEventListener('ended', () => {
    console.log('Audio ended');
    sm.dispatchEvent(AudioStateMachine.EventId.SPEECH_OVER); // leads to TEXT_DISPLAYED state
  });

  elements.backgroundTrack?.addEventListener('ended', () => {
    console.log('Background track ended');
    sm.dispatchEvent(AudioStateMachine.EventId.MUSIC_OVER); // leads to MUSIC_ENDED state
  });

  elements.fromStartButton?.addEventListener("click", () => {
    console.log('Replay clicked');
    sm.dispatchEvent(AudioStateMachine.EventId.FROM_START_CLICKED); // leads to REPLAYING state
  });

  elements.backgroundTrack?.addEventListener('ended', () => {
    sm.dispatchEvent(AudioStateMachine.EventId.MUSIC_OVER);
  });
}

export function toggleDifficulty() {
  elements.difficultySelector.addEventListener("click", () => {
    let currentIndex = 0;
    const difficulties = ["beginner", "intermediate", "expert"];
    currentIndex = (currentIndex + 1) % difficulties.length; // Loop: 0→1→2→0
    const newDifficulty = difficulties[currentIndex];
  
    difficultySelector.textContent = newDifficulty.charAt(0).toUpperCase() + newDifficulty.slice(1); // "Beginner"
    difficultySelector.setAttribute("data-value", newDifficulty);
  
    return newDifficulty;
  })
};
