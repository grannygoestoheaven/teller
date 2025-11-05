import { elements } from "./config.js"; 

export function loadPlayer(data) {
  elements.speech.src = data.speechUrl;
  elements.backgroundTrack.src = data.trackUrl;
  console.log("DIAGNOSTIC: Audio sources were successfully set.");
  // clearPlaybackTimers(elements.speech, b);
}

export function startSpeech() {
  elements.speech.currentTime = 0;
  elements.speech.play();
}

export function startMusic() {  
  elements.backgroundTrack.currentTime = 0;
  elements.backgroundTrack.play();
}

export function syncAll() {
  // Keep speech as master
  const drift = elements.backgroundTrack.currentTime - elements.speech.currentTime;
  
  if (Math.abs(drift) > 0.2) {  // >200ms noticeable
    elements.backgroundTrack.currentTime = elements.speech.currentTime;
  }
}

export function abortProcess() {
  abortController?.abort(); // cancels the fetch if still pending
}

// Helper functions to pause/resume speech and background audio separately
export function pauseSpeechOnly() {
  elements.speech.pause();
}
export function resumeSpeechOnly() {
  elements.speech.play();
}
export function pauseBackgroundOnly() {
  elements.backgroundTrack.pause();
}
export function resumeBackgroundOnly() {
  elements.backgroundTrack.play();
}

export function pauseAllAudio() {
  elements.speech.pause();
  elements.backgroundTrack.pause();
}

export function resumeAllAudio() {
  elements.speech.play()
  elements.backgroundTrack.play();
}

export function resetAllAudio(){
  elements.speech.currentTime = 0;
  elements.backgroundTrack.currentTime = 0;
}

export function stopAndResetAllAudio() {
  pauseAllAudio();
  resetAllAudio();
}

export function setUpAndStartAllAudio() {
  setBgVolume();
  resumeBackgroundOnly();
  delaySpeechStart();
}

export function setBgVolume(volume = 0.2) {
  elements.backgroundTrack.volume = volume;
}

export function delaySpeechStart(ms = 5000) {
  setTimeout(() => {
    elements.speech.play();
  }, ms);
}
