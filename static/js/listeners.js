import { elements } from './config.js';

export function events(sm) {
  window.addEventListener('keydown', (event) => {
    event.preventDefault();
    if (event.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
      event.preventDefault();
      sm.dispatchEvent(AudioSm.EventId.PLAY_PAUSE_CLICKED); // leads to PLAYING state or PAUSED state
    }
  });

  elements.formInput?.addEventListener('input', () => {
    sm.dispatchEvent(AudioSm.EventId.FORM_NOT_EMPTY); // leads to READY state
  });

  elements.form?.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log('Form submitted');
    sm.dispatchEvent(AudioSm.EventId.FORM_SUBMITTED) // leads to LOADING state
  });

  elements.speech?.addEventListener('canplaythrough', () => {
    console.log('Audio ready to play');
    sm.dispatchEvent(AudioSm.EventId.SPEECH_READY); // leads to PLAYING state
  });

  elements.speech?.addEventListener('ended', () => {
    console.log('Audio ended');
    sm.dispatchEvent(AudioSm.EventId.SPEECH_OVER); // leads to TEXT_DISPLAYED state
  });

  elements.backgroundTrack?.addEventListener('ended', () => {
    console.log('Background track ended');
    sm.dispatchEvent(AudioSm.EventId.MUSIC_OVER); // leads to MUSIC_ENDED state
  });

  // elements.stopButton?.addEventListener("click", () => {
  //   console.log('Stop clicked');
  //   sm.dispatchEvent(AudioSm.EventId.CANCEL); // leads to IDLE state
  // });

  elements.fromStartButton?.addEventListener("click", () => {
    console.log('Replay clicked');
    sm.dispatchEvent(AudioSm.EventId.FROM_START_CLICKED); // leads to REPLAYING state
  });

  elements.backgroundTrack?.addEventListener('ended', () => {
    sm.dispatchEvent(AudioSm.EventId.MUSIC_OVER);
  });
}

