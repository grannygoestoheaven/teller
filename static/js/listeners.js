// uiEvents.js
export function events(sm, {form, formInput, speechAudio, replayBtn, playPauseBtn, stopBtn}) {

    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
      }
    });
  
    formInput?.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent default form submission
        sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
      }
    });

    formInput?.addEventListener('input', () => {
      console.log('Input event fired!');
      sm.dispatchEvent(AudioSm.EventId.FORM_NOT_EMPTY)
    })
  
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      startOrRestartNewStory(sm, formInput);
    });
    
    speechAudio?.addEventListener('canplaythrough', () => {
      sm.dispatchEvent(AudioSm.EventId.SPEECH_READY); // leads to LOADING state
    });

    speechAudio?.addEventListener('onended', () => {
      sm.dispatchEvent(AudioSm.EventId.SPEECH_OVER); // leads to TEXT_DISPLAYED state
    })
    
    playPauseBtn?.addEventListener("click", () => {
      // sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
      startOrRestartNewStory(sm, formInput);
    });
    
    stopBtn?.addEventListener("click", () => {
      sm.dispatchEvent(AudioSm.EventId.CANCEL); // leads to IDLE state
    });

    replayBtn?.addEventListener("click", () => {
      sm.dispatchEvent(AudioSm.EventId.REPLAY_BTN_CLICKED); // leads to PLAYING state
    });
  }
  
  function startOrRestartNewStory(sm, formInput) {
    const ready = formInput.value.trim().length >= 1;
    if (!ready) return;
  
    if (sm._stateId === AudioSm.StateId.IDLE) {
      sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED); // lead to PLAYING state
    } else {
      sm.dispatchEvent(AudioSm.EventId.CANCEL);
      sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
    }
  }
