import { elements } from './config.js';

export function events(sm) {
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
      event.preventDefault();
      sm.dispatchEvent(AudioStateMachine.EventId.SPACEBAR_TOGGLE_PAUSE_RESUME); // leads to PAUSED state or PLAYING (resumed) state
    }
  });

  elements.formInput?.addEventListener('input', () => {
    console.log('Form input changed');
    sm.dispatchEvent(AudioStateMachine.EventId.INPUT_CHANGED); // leads to READY state
  });

  elements.form?.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log('Form submitted');
    sm.dispatchEvent(AudioStateMachine.EventId.FORM_SUBMITTED) // leads to LOADING state
  });

  elements.playPauseButton?.addEventListener("click", () => {
    console.log('Play/Pause clicked');
    sm.dispatchEvent(AudioStateMachine.EventId.PLAY_PAUSE_CLICKED); // leads to PLAYING state or PAUSED state
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

  // elements.stopButton?.addEventListener("click", () => {
  //   console.log('Stop clicked');
  //   sm.dispatchEvent(AudioStateMachine.EventId.CANCEL); // leads to IDLE state
  // });

  elements.fromStartButton?.addEventListener("click", () => {
    console.log('Replay clicked');
    sm.dispatchEvent(AudioStateMachine.EventId.FROM_START_CLICKED); // leads to REPLAYING state
  });

  elements.backgroundTrack?.addEventListener('ended', () => {
    sm.dispatchEvent(AudioStateMachine.EventId.MUSIC_OVER);
  });
}
