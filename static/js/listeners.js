import { elements } from './config.js';

export function events(sm) {
  window.addEventListener('keydown', (event) => {
        event.preventDefault();
        sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED); // leads to PLAYING state or PAUSED state
  });

  elements.form?.addEventListener('keydown', (event) => {
      event.preventDefault();
      sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED); // leads to PLAYING state
  });

  elements.formInput?.addEventListener('input', () => {
    sm.dispatchEvent(AudioSm.EventId.FORM_NOT_EMPTY); // leads to READY state
  });

  elements.form?.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log('Form submitted');
    startOrRestartNewStory(sm, elements.formInput); // leads to LOADING state
  });

  elements.speech?.addEventListener('canplaythrough', () => {
    console.log('Audio ready to play');
    sm.dispatchEvent(AudioSm.EventId.SPEECH_READY); // leads to PLAYING state
  });

  elements.speech?.addEventListener('ended', () => {
    console.log('Audio ended');
    sm.dispatchEvent(AudioSm.EventId.SPEECH_OVER); // leads to TEXT_DISPLAYED state
  });

  elements.playPauseButton?.addEventListener("click", () => {
    console.log('Play/Pause clicked');
    startOrRestartNewStory(sm, elements.formInput); // leads to LOADING state
  });

  elements.stopButton?.addEventListener("click", () => {
    console.log('Stop clicked');
    sm.dispatchEvent(AudioSm.EventId.CANCEL); // leads to IDLE state
  });

  elements.replayButton?.addEventListener("click", () => {
    console.log('Replay clicked');
    sm.dispatchEvent(AudioSm.EventId.REPLAY_BTN_CLICKED); // leads to REPLAYING state
  });
}

export function startOrRestartNewStory (sm) {
  const ready = newInput.value.trim().length >= 1;
  console.log(ready);
  console.log(newInput.value);
  if (!ready) {
    console.log('Form input empty, abort');
    return;
  }

  if (sm.prevStateId === AudioSm.StateId.IDLE) {
    console.log('Starting new story');
    sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
  } else {
    console.log('Restarting story');
    sm.dispatchEvent(AudioSm.EventId.CANCEL); // leads to IDLE state
    sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED); // leads to PLAYING state with a new story
  }
}
