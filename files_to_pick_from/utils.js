export function clearPlaybackTimers() {
    clearInterval(speechAudio._fadeInterval);
    clearInterval(backgroundAudio._fadeInterval);
    clearTimeout(bgFadeTimeout);
    clearTimeout(bgFadeOutTimeout);
  }
  