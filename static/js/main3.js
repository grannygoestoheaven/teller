// main.js
import { saveStoryToStorage, loadStoryFromStorage } from './storage.js';
import { initLoadingElements, showLoadingAnimation, hideLoadingAnimation } from './loadingAnimation.js';
import { initTextStreamer, streamText, clearHighlights } from './textStreamer.js';
import {
  initAudioElements,
  handleAudioPlayback,
  togglePlayPause,
  replayPlayback,
  NEW_PLAY_FADE_OUT,
  FADE_STEP,
  BG_INITIAL_VOLUME
} from './audioControls3.js';

document.addEventListener('DOMContentLoaded', () => {
  // Form and UI elements
  const form = document.getElementById('story-form');
  const overlay = document.querySelector('.blur-overlay');
  const chatHistory = document.getElementById('chatHistory');
  const subjectInput = document.getElementById('subject');
  const subjectPlaceholder = document.getElementById('subjectPlaceholder');// after you grab subjectInput…
  subjectInput.style.overflow = 'hidden';
  subjectInput.style.height   = 'auto';
  // capture its one-line default
  const minHeight = subjectInput.clientHeight;
  const adjustSubjectHeight = () => {
    subjectInput.style.height = 'auto';
    const h = Math.max(subjectInput.scrollHeight, minHeight);
    subjectInput.style.height = h + 'px';
  };
  subjectInput.addEventListener('input', adjustSubjectHeight);
  adjustSubjectHeight();
  const generateButton = document.getElementById('generateButton');
  const stopButton = document.getElementById('stopButton');
  const replayButton = document.getElementById('replayButton');
  const speechAudio = document.getElementById('speechAudio');
  const backgroundAudio = document.getElementById('backgroundAudio');
  const loadingAnimationContainer = document.getElementById('loadingAnimationContainer');
  const loadingAnimation = document.getElementById('loadingAnimation');
  const period1 = loadingAnimation.querySelector('.period-1');
  const period2 = loadingAnimation.querySelector('.period-2');
  const period3 = loadingAnimation.querySelector('.period-3');

  // replayButton.disabled = true;

  // Track whether we have a story loaded that can actually be replayed
  let canReplay = false;

  // Centralized state update
  const updateReplayState = () => {
    // Disabled if:
    //  • we haven’t loaded a story yet (canReplay === false)
    //  • OR the form has content (user is typing a new request)
    replayButton.disabled = !canReplay || subjectInput.value.trim().length > 0;
  };

  // 1) On load, there’s nothing to replay
  updateReplayState();

  // 2) Whenever the user types a new subject, disable replay
  subjectInput.addEventListener('input', updateReplayState);

  // 3) When the speech ends, we know we have a fresh story to replay
  document.addEventListener('speechEnded', () => {
    canReplay = true;
    updateReplayState();
  });
  
  // Initialize subsystems
  initAudioElements({ speech: speechAudio, background: backgroundAudio });
  initLoadingElements(loadingAnimationContainer, loadingAnimation, period1, period2, period3, chatHistory, overlay);
  initTextStreamer(chatHistory, subjectInput);
  // updateButtons('stopped');

  loadingAnimationContainer.style.display = 'none';

  let currentStoryText = '';
  let state = 'Idle'; // "Idle" | "Playing" | "Paused"
  let isGenerating = false;

  // ─── Submit handler (generate new story) ───
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (state !== 'Idle' || isGenerating) return;
    
    const subject = subjectInput.value.trim();
    if (!subject) return;

    state = 'Playing';
    isGenerating = true;
    showLoadingAnimation();
    subjectInput.value = '';

    try {
      const formData = new FormData();
      formData.append('subject', subject);
      const res = await fetch('/generate_story', { method: 'POST', body: formData });
      if (!res.ok) { 
        throw new Error((await res.json()).error || `Error ${res.status}`);
      }
      const data = await res.json();
      currentStoryText = data.story;
      
      await handleAudioPlayback(data)
      
      // await handleAudioPlayback({
        // audio_url:"static/audio/generated_stories/the_chronology_protection_conjecture.mp3",
        // track_url:"static/audio/local_ambient_tracks/abstract_aprils_hold.mp3"
      // });

      // saveStoryToStorage(data.story, subject);
    } catch (err) {
      console.error(err);
      hideLoadingAnimation();
      chatHistory.innerHTML = `<div class="message error">Error: ${err.message}</div>`;
      state = 'Idle';
      generateButton.textContent = 'Play';
    } finally {
      isGenerating = false;
    }
  });

  // ─── Play / Pause toggle ───
  generateButton.addEventListener('click', async (e) => {
    if (state === 'Idle') return;
    e.preventDefault();
    await togglePlayPause();
    if (state === 'Playing') {
      state = 'Paused';
      generateButton.textContent = 'Resume';
    } else {
      state = 'Playing';
      generateButton.textContent = 'Pause';
    }
  });

  // // ─── Stop ───
  // stopButton.addEventListener('click', (e) => {
  //   e.preventDefault();
  //   stopPlayback();
  //   state = 'Idle';
  //   generateButton.textContent = 'Play';
  // });

  // ─── Replay ───
  replayButton.addEventListener('click', (e) => {
    e.preventDefault();
    replayPlayback();
    state = 'Playing';
    generateButton.textContent = 'Pause';
  });

  // ─── Story-ended cleanup ───
  document.addEventListener('speechEnded', () => {
    hideLoadingAnimation();
    streamText(currentStoryText, chatHistory);
    chatHistory.classList.add('text-full');
    state = 'Idle';
    generateButton.textContent = 'Play';
  });

  // ─── Keyboard shortcuts ───
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();           // stop the newline
      if (state === 'Idle') {
        form.requestSubmit();       // launch the story
      }
    }
    if (e.key === ' ' && (state === 'Playing' || state === 'Paused')) {
      e.preventDefault(); generateButton.click();
    }
  });

  // ─── Initial cleanup ───
  clearHighlights();
});
