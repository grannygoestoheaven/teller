import { elements } from '/static/js/config.js';
import { cycleToNextTopic, mapValuesToSquares } from '/static/js/uiInit.js';
import { toggleView } from '/static/js/ui.js';
// import { uiClearInput } from './ui.js';

export function stateMachineEvents(sm) {
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

  // elements.form?.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   console.log('Form submitted');
  //   sm.dispatchEvent(AudioStateMachine.EventId.FORM_SUBMITTED) // leads to LOADING state
  // });

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

  // elements.gridSquares.forEach(square => {
  //   square.addEventListener('mouseenter', () => {
  //     let currentPlayingSquare = getCurrentPlayingSquare();
  //     if (!currentPlayingSquare){
  //       elements.formInput.value = square.dataset.compactSubject;
  //       elements.formInput.dispatchEvent(new Event('input', { bubbles: true }));
  //     }
  //   });
  
  // if (elements.formInput.dataset.locked !== 'true') {
    // elements.formInput.value = square.dataset.compactSubject;
  // }
  
  // elements.gridSquares.forEach(square => {
  //   square.addEventListener('click', () => {
  //     sm.dispatchEvent(AudioStateMachine.EventId.FORM_SUBMITTED); // Pass full version to backend
  //   });
  // });

  elements.gridSquares.forEach(square => {
    square.addEventListener('click', () => { // we need to get sure the click happens only inside the grid - to prevent triggering reassigment of activeSquare when clicking outside, like when choosing a new topic.
      elements.activeSquare = square; // Store reference
      console.log('Square clicked:', elements.activeSquare.dataset.fullSubject);
      sm.dispatchEvent(AudioStateMachine.EventId.SQUARE_CLICKED);
    });
  });

  elements.toggleButton?.addEventListener('click', () => {
    console.log('Toggling grid visibility');
    sm.dispatchEvent(AudioStateMachine.EventId.VIEW_TOGGLED);
    // toggleView();
  });
}

export function staticListeners() {
  
  elements.gridSquares.forEach(square =>
    square.addEventListener('mouseenter', () => {
      if (elements.formInput.dataset.locked !== 'true') {
        elements.formInput.value = square.dataset.compactSubject;
      }
      // elements.formInput.dispatchEvent(new Event('input', { bubbles: true }));
      console.log(square.dataset.fullSubject);
  }));

  // elements.gridSquares.forEach(square => {
  //   square.addEventListener('mouseenter', () => {
  //     if (elements.formInput.dataset.locked !== 'true') {
  //       elements.formInput.value = square.dataset.compactSubject;
  //     }
  //   })
  // });

  // Title click handler - now handles both topic cycling and state machine events
  elements.title?.addEventListener('click', (e) => {
    // Prevent text selection and default behavior
    e.preventDefault();
    e.stopPropagation();

    // Cycle to next topic
    cycleToNextTopic();
    mapValuesToSquares();
    // sm.dispatchEvent(AudioStateMachine.EventId.CANCEL); // leads to IDLE state
  });
  
  // Prevent double-click text selection on title
  elements.title?.addEventListener('mousedown', (e) => {
    if (e.detail > 1) {
      e.preventDefault();
    }
  });
  
  // Prevent text selection on subtitle (for future functionality)
  elements.subtitle?.addEventListener('mousedown', (e) => {
    e.preventDefault();
  });
  
  // Subtitle click handler - currently a placeholder for future functionality
  elements.subtitle?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Subtitle clicked - ready for future functionality');
  });
}

// export function toggleDifficulty() {
//   elements.difficultySelector.addEventListener("click", () => {
//     let currentIndex = 0;
//     const difficulties = ["beginner", "intermediate", "expert"];
//     currentIndex = (currentIndex + 1) % difficulties.length; // Loop: 0→1→2→0
//     const newDifficulty = difficulties[currentIndex];
  
//     difficultySelector.textContent = newDifficulty.charAt(0).toUpperCase() + newDifficulty.slice(1); // "Beginner"
//     difficultySelector.setAttribute("data-value", newDifficulty);

//     return newDifficulty;
//   })
// };

// Wake up listeners and Set the input field to the current time in "HH:MM" format
// export function wakeUpListeners(sm) {
//   const now = new Date();
//   const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   elements.formInput.value = timeString;
//   sm.dispatchEvent(AudioStateMachine.EventId.INPUT_CHANGED, { value: timeString });
// }
