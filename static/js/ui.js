// uiEvents.js
export function initEvents(sm) {

  initInputAdjustments(subjectInput, subjectPlaceholder)

  window.addEventListener('keydown', (event) => {
    if (event.code === ' ') {
      sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
    }
  });

  form?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default form submission
      sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    startOrRestartStory(sm, formInput);
  });

  speechAudio?.addEventListener('canplaythrough', () => {
    sm.dispatchEvent(AudioSm.EventId.SPEECH_READY);
  });

  playPauseBtn?.addEventListener("click", () => {
    sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
  });
  
  replayBtn?.addEventListener("click", () => {
    sm.dispatchEvent(AudioSm.EventId.REPLAY);
  });

  stopBtn?.addEventListener("click", () => {
    sm.dispatchEvent(AudioSm.EventId.CANCEL);
  });
}

function initInputAdjustments(subjectInput, subjectPlaceholder, minHeight = 24) {
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

function startOrRestartStory(sm, formInput) {
  const ready = formInput.value.trim().length > 1;
  if (!ready) return; // nothing happens if input too short

  if (sm.isInState(AudioSm.StateId.IDLE)) {
    sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
  } else {
    sm.dispatchEvent(AudioSm.EventId.CANCEL);
    sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
  }
}

subjectInput.style.overflow = 'hidden';
  subjectInput.style.height = 'auto';