import { elements, getIsGridVisible, getIsChatVisible } from './config.js';
import { toggleView } from './ui.js';

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

  elements.toggleButton?.addEventListener('click', () => {
    console.log('Toggling grid visibility');
    let isGridVisible = getIsGridVisible();
    isGridVisible = !isGridVisible;
    toggleView(isGridVisible);
  });

  elements.gridSquares.forEach(square => {
    square.addEventListener('mouseenter', () => {
      elements.formInput.value = square.dataset.compactSubject;
    });
  
    square.addEventListener('click', () => {
      console.log("Square clicked! Current state:", sm.currentState);
      sm.dispatchEvent(AudioStateMachine.EventId.FORM_SUBMITTED); // Pass full version to backend
    });
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

// Wake up listeners and Set the input field to the current time in "HH:MM" format
export function wakeUpListeners(sm) {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  elements.formInput.value = timeString;
  sm.dispatchEvent(AudioStateMachine.EventId.INPUT_CHANGED, { value: timeString });
}
