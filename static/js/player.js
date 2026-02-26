import { elements } from "/static/js/config.js";

let speechTimeout = null;
let speechStartDelay = 5000; // Default 5 second delay
let remainingDelay = 0;
let isPausedDuringDelay = false;
let hasInitialSyncOccurred = false;

export function loadPlayer(data) {
  console.log('Loading player with last story data...');

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
  elements.backgroundTrack.volume = 0.02;
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

// export function pauseAllAudio() {
//   elements.speech.pause();
//   elements.backgroundTrack.pause();

//   if (speechTimeout) {
//     clearTimeout(speechTimeout);
//     // Calculate how much delay was remaining
//     const elapsed = speechStartDelay - remainingDelay;
//     remainingDelay = Math.max(0, remainingDelay - elapsed);
//     if (remainingDelay > 0) {
//       isPausedDuringDelay = true;
//     }
//   }
// }

// export function pauseAllAudio() {
//   elements.speech.pause();
//   elements.backgroundTrack.pause();
// }

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

// export function resumeAllAudio() {
//   elements.backgroundTrack.play();

//   if (isPausedDuringDelay) {
//     // Resume the speech delay
//     delaySpeechStart(remainingDelay);
//     isPausedDuringDelay = false;
//   } else if (!elements.speech.ended) {
//     elements.speech.play();
//   }
// }

// export function resumeAllAudio() {
//   elements.backgroundTrack.play();
//   if (!elements.speech.ended) {  // Only resume speech if not finished
//     elements.speech.play();
//   }
// }

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

// export function delaySpeechStart(ms = 5000) {
//   if (speechTimeout) clearTimeout(speechTimeout);

//   speechStartDelay = ms;
//   remainingDelay = ms;

//   speechTimeout = setTimeout(() => {
//     if (!elements.backgroundTrack.paused) { // Only start if music is playing
//       elements.speech.play();
//     } else {
//       // If paused during delay, remember to start speech when resumed
//       isPausedDuringDelay = true;
//     }
//   }, ms);
// }

// export function delaySpeechStart(ms = 5000) {
//   if (speechTimeout) clearTimeout(speechTimeout); // Clear the speech timeout
//   elements.speech.volume = 1.0;
//   speechTimeout = setTimeout(() => {
//     elements.speech.play();
//   }, ms);
// }

// Clear all our timers/intervals
export function clearPlaybackTimers() {
  clearInterval(speechAudio._fadeInterval);
  clearInterval(backgroundAudio._fadeInterval);
  clearTimeout(bgFadeTimeout);
  clearTimeout(bgFadeOutTimeout);
}
