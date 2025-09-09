// uiEvents.js
export function initEvents(sm, {form, formInput, replayBtn, playPauseBtn, stopBtn}) {

  initInputAdjustments(subjectInput, subjectPlaceholder)

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

function initInputAdjustments(subjectInput, subjectPlaceholder, minHeight = subjectInput.clientHeight) {
  const adjustInput = () => {
    subjectInput.style.overflow = 'hidden'
    subjectInput.style.height = 'auto';
    const h = Math.max(subjectInput.scrollHeight, minHeight);
    subjectInput.style.height = h + 'px';
    subjectPlaceholder.style.display = subjectInput.value ? 'none' : 'block';
  };
  
  subjectInput.addEventListener('input', adjustInput);
  adjustInput(); // initialize on load
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
