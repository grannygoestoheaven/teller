// audioControls.js
import { onTextDataReceived, addBlurr, removeBlurr } from "./loadingAnimation.js";

// Constants (tweak durations as needed)
const BG_FADE_IN  = 10000;  // ms
const BG_LINGER   = 35000;  // ms after speech end
const BG_FADE_OUT = 30000;  // ms
const POST_DELAY  = 3000;   // ms after fade-in to start speech
const FADE_STEP   = 50;     // ms per step

let speechAudio, backgroundAudio;
let lastData = null;
let bgFadeTimeout, bgFadeOutTimeout;
let speechStarted = false;

// Generic fade utility using HTMLAudioElement.volume
export function fadeVolume(el, from, to, duration, stepTime = FADE_STEP, onEnd) {
  const steps = Math.ceil(duration / stepTime);
  let currentStep = 0;
  const delta = (to - from) / steps;
  el.volume = from;
  clearInterval(el._fadeInterval);
  el._fadeInterval = setInterval(() => {
    currentStep++;
    el.volume = Math.min(Math.max(el.volume + delta, 0), 1);
    if (currentStep >= steps) {
      clearInterval(el._fadeInterval);
      el.volume = to;
      if (typeof onEnd === 'function') onEnd();
    }
  }, stepTime);
}

// Initialize with actual <audio> elements
export function initAudioElements({ speech, background }) {
  speechAudio     = speech;
  backgroundAudio = background;
  speechAudio.volume     = 1;
  backgroundAudio.volume = 0.04; // Set initial background volume
}

// Primary playback handler (JS-only fades, no Web Audio API)
export async function handleAudioPlayback(data) {
  speechStarted = false;
  clearPlaybackTimers();
  lastData = data;
  
  // Disable play/pause until background music starts
  const playBtn = document.getElementById('generateButton');
  playBtn.disabled = true;
  updateButtons('playing');
  const enablePause = () => {
      playBtn.disabled = false;
      backgroundAudio.removeEventListener('playing', enablePause);
    };
    backgroundAudio.addEventListener('playing', enablePause);
    
    speechAudio.src     = data.audio_url;
    backgroundAudio.src = data.track_url;
    speechAudio.currentTime     = 0;
    backgroundAudio.currentTime = 0;
    backgroundAudio.loop        = false;
    
  console.log(onTextDataReceived()); // Makes the dots change color
  // Begin background fade-in
  backgroundAudio.play();
  console.log('playing background audio');
  fadeVolume(backgroundAudio, 0, backgroundAudio.volume, BG_FADE_IN);

  // After fade-in + delay, start speech
  bgFadeTimeout = setTimeout(() => {
    if (backgroundAudio.paused) {
      // Wait: speech starts only after user resumes
      const onResume = () => {
        speechStarted = true;
        speechAudio.play();
        backgroundAudio.removeEventListener('play', onResume);
      };
      backgroundAudio.addEventListener('play', onResume);
    } else {
      speechStarted = true;
      speechAudio.play();
    }
  }, BG_FADE_IN + POST_DELAY);

  // When speech ends: dispatch event, then schedule BG fade-out
  speechAudio.onended = () => {
    document.dispatchEvent(
      new CustomEvent('speechEnded', { detail: { storyText: data.story } })
    );
    bgFadeOutTimeout = setTimeout(() => {
      fadeVolume(backgroundAudio, backgroundAudio.volume, 0, BG_FADE_OUT, FADE_STEP, () => {
        backgroundAudio.pause();
        updateButtons('stopped');
      });
    }, BG_LINGER);
  };
}

// Pause/resume both speech and background together
export function togglePlayPause() {
  // If speech has not started, just pause/resume background
  if (!speechStarted) {
    if (backgroundAudio.paused) {
      backgroundAudio.play();
      updateButtons('playing');
    } else {
      backgroundAudio.pause();
      updateButtons('paused');
    }
    return;
  }

  // After speech started, pause/resume both
  if (speechAudio.paused || backgroundAudio.paused) {
    speechAudio.play();
    backgroundAudio.play();
    updateButtons('playing');
  } else {
    speechAudio.pause();
    backgroundAudio.pause();
    updateButtons('paused');
  }
}

// Fully stop playback, reset to start
export function stopPlayback() {
  speechStarted = false;
  clearPlaybackTimers();
  speechAudio.pause();
  backgroundAudio.pause();
  speechAudio.currentTime     = 0;
  backgroundAudio.currentTime = 0;
  speechAudio.volume         = 1;
  backgroundAudio.volume     = 0;
  updateButtons('stopped');
}

// Replay the last story from the beginning
export function replayPlayback() {
  if (lastData) handleAudioPlayback(lastData);
}

// Clear all our timers/intervals
export function clearPlaybackTimers() {
  clearInterval(speechAudio._fadeInterval);
  clearInterval(backgroundAudio._fadeInterval);
  clearTimeout(bgFadeTimeout);
  clearTimeout(bgFadeOutTimeout);
}

// UI button state management (assumes buttons with these IDs)
export function updateButtons(state) {
  const playBtn   = document.getElementById('generateButton');
  // const stopBtn   = document.getElementById('stopButton');
  const replayBtn = document.getElementById('replayButton');

  playBtn.disabled   = false;
  // stopBtn.disabled   = (state === 'stopped');
  // replayBtn.disabled = (state === 'playing' || state === 'paused');

  if (state === 'playing') {
    playBtn.textContent = 'PAUSE';
    removeBlurr(); // Remove blurr effect when stopped or idle
  } else if (state === 'paused') {
    playBtn.textContent = 'RESUME';
    addBlurr(); // Add blurr effect when paused
  } else {
    playBtn.textContent = 'PLAY';
  }
}

// export function updateButtons(state) {
//   const playBtn   = document.getElementById('generateButton');
//   const stopBtn   = document.getElementById('stopButton');
//   const replayBtn = document.getElementById('replayButton');
//   const subjectInput = document.getElementById('subject');
//   const subjectEmpty = subjectInput && !subjectInput.value.trim();

//   // Replay always enabled
//   if (replayBtn) replayBtn.disabled = false;
//   // Stop enabled only when playing or paused
//   if (stopBtn) stopBtn.disabled = (state === 'stopped' || state === 'Idle');

//   // Play button logic
//   if (playBtn) {
//     switch(state) {
//       case 'Idle':
//         // New story only if subject is filled
//         playBtn.disabled = subjectEmpty;
//         playBtn.textContent = 'PLAY';
//         break;
//       case 'Playing':
//         playBtn.disabled = false;
//         playBtn.textContent = 'PAUSE';
//         break;
//       case 'Paused':
//         playBtn.disabled = false;
//         playBtn.textContent = 'RESUME';
//         break;
//       default:
//         playBtn.disabled = subjectEmpty;
//         playBtn.textContent = 'PLAY';
//     }
//   }
// }