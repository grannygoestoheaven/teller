import { elements } from "./config.js";

let speechTimeout = null;
let speechStartDelay = 5000; // Default 5 second delay
let remainingDelay = 0;
let isPausedDuringDelay = false;
let hasInitialSyncOccurred = false;

export function loadPlayer(data) {
  console.log('Loading player with last story data...');
  console.log(data.speechUrl)

  if (data.speechUrl) {
    elements.speech.src = data.speechUrl;
    elements.backgroundTrack.src = data.trackUrl;
    elements.backgroundTrack.loop = false;
    console.log("DIAGNOSTIC: Audio sources were successfully set.");
    // clearPlaybackTimers(elements.speech, b);
  }
}

export function startSpeech() {
  elements.speech.currentTime = 0;
  elements.speech.volume = 1;
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
  elements.backgroundTrack.volume = 0.03;
  elements.backgroundTrack.play();
}

export function pauseAllAudio() {
  elements.speech.pause();
  elements.backgroundTrack.pause();

  if (speechTimeout && !hasInitialSyncOccurred) {
    clearTimeout(speechTimeout);
    // Calculate remaining delay based on how much music has played
    const musicPlayed = elements.backgroundTrack.currentTime;
    remainingDelay = Math.max(0, speechStartDelay - (musicPlayed * 1000));
    isPausedDuringDelay = true;
  }
}

export function resumeAllAudio() {
  elements.backgroundTrack.play();

  if (isPausedDuringDelay) {
    // Resume the speech delay
    delaySpeechStart(remainingDelay);
    isPausedDuringDelay = false;
  } else if (!elements.speech.ended) {
    elements.speech.play();
  }
}

export function rewind5Seconds() {
  elements.speech.currentTime = Math.max(0, elements.speech.currentTime - 5);
  elements.backgroundTrack.currentTime = Math.max(0, elements.backgroundTrack.currentTime - 5);
}

export function forward5Seconds() {
  elements.speech.currentTime = Math.min(elements.speech.duration, elements.speech.currentTime + 5);
  elements.backgroundTrack.currentTime = Math.min(elements.backgroundTrack.duration, elements.backgroundTrack.currentTime + 5);
}

export function resetAllAudio(){
  elements.speech.currentTime = 0;
  elements.backgroundTrack.currentTime = 0;
}

export function stopAndResetAllAudio() {
  pauseAllAudio();
  resetAllAudio();
  // uiIdle();
}

export function setUpAndStartAllAudio() {
  resumeBackgroundOnly();
  delaySpeechStart();
}

export function bothTracksEnded() {
  return elements.speech.ended && elements.backgroundTrack.ended;
}

export function setBgVolume(volume = 0.07) {
  elements.backgroundTrack.volume = volume;
}

export function delaySpeechStart(ms = 5000) {
  if (speechTimeout) clearTimeout(speechTimeout);

  speechStartDelay = ms;
  remainingDelay = ms;

  speechTimeout = setTimeout(() => {
    if (!elements.backgroundTrack.paused) {
      elements.speech.play();
      hasInitialSyncOccurred = true; // Mark that initial sync is done
    } else {
      isPausedDuringDelay = true;
    }
  }, ms);
}

// Clear all our timers/intervals
export function clearPlaybackTimers() {
  clearInterval(speechAudio._fadeInterval);
  clearInterval(backgroundAudio._fadeInterval);
  clearTimeout(bgFadeTimeout);
  clearTimeout(bgFadeOutTimeout);
}

export function muteBackgroundTrack() {
  elements.backgroundTrack.volume = 0;
}

export function unmuteBackgroundTrack() {
  elements.backgroundTrack.volume = 0.03;
}
