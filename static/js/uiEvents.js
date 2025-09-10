// uiEvents.js
export function Events(sm, {form, formInput, speechAudio, replayBtn, playPauseBtn, stopBtn}) {

    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
      }
    });
  
    form?.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent default form submission
        sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
      }
    });
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      startOrRestartNewStory(sm, formInput);
    });
    
    speechAudio?.addEventListener('canplaythrough', () => {
      sm.dispatchEvent(AudioSm.EventId.SPEECH_READY);
    });
    
    playPauseBtn?.addEventListener("click", () => {
      // sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
      startOrRestartNewStory(sm, formInput);
    });
    
    replayBtn?.addEventListener("click", () => {
      sm.dispatchEvent(AudioSm.EventId.REPLAY);
    });
    
    stopBtn?.addEventListener("click", () => {
      sm.dispatchEvent(AudioSm.EventId.CANCEL);
    });
  }
  function startOrRestartNewStory(sm, formInput) {
    const ready = formInput.value.trim().length >= 1;
    if (!ready) return;
  
    if (sm.isInState(AudioSm.StateId.IDLE)) {
      sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
    } else {
      sm.dispatchEvent(AudioSm.EventId.CANCEL);
      sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
    }
  }
  