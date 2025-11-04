import { elements } from "./config.js"; 

export function loadPlayer(data) {
  elements.speech.src = data.speechUrl;
  elements.backgroundTrack.src = data.trackUrl;
  console.log("DIAGNOSTIC: Audio sources were successfully set.");
  // clearPlaybackTimers(elements.speech, b);
}

export function startSpeech() {
  // delay speech start by 3s
  setTimeout(() => {
    elements.speech.currentTime = 0;
    elements.speech.play();
  }, 5000);
}

export function startMusic() {  
  elements.backgroundTrack.currentTime = 0;
  elements.backgroundTrack.volume = 0.2;
  elements.backgroundTrack.play();
}

export function replay() {
  elements.speech.currentTime = 0;
  elements.backgroundTrack.currentTime = 0;
  elements.speech.play();
  elements.backgroundTrack.play();
}

export function syncAll() {
  // Keep speech as master
  const drift = elements.backgroundTrack.currentTime - elements.speech.currentTime;
  
  if (Math.abs(drift) > 0.2) {  // >200ms noticeable
    elements.backgroundTrack.currentTime = elements.speech.currentTime;
  }
}

export function stopAll(){
  elements.speech.currentTime = 0;
  elements.backgroundTrack.currentTime = 0;
  abortController?.abort(); // cancels the fetch if still pending
}

export function pauseAllAudio() {
  elements.speech.pause();
  elements.backgroundTrack.pause();
}

export function resumeAllAudio() {
  elements.speech.play()
  elements.backgroundTrack.volume = 0.3;
  elements.backgroundTrack.play();
};
