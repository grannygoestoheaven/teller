let speechAudio;
let backgroundAudio;

export function initPlayer({ speech, background }) {
  speechAudio = speech;
  backgroundAudio = background;
}

export function startSpeech() {
  // delay speech start by 3s
  setTimeout(() => {
    speechAudio.currentTime = 0;
    speechAudio.play();
  }, 5000);
}

export function startMusic() {
  backgroundAudio.currentTime = 0;
  backgroundAudio.play();
}

export function syncAll() {
  // Keep speech as master
  const drift = backgroundAudio.currentTime - speechAudio.currentTime;

  if (Math.abs(drift) > 0.2) {  // >200ms noticeable
    backgroundAudio.currentTime = speechAudio.currentTime;
  }
}
