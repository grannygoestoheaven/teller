import { handleAppEvent, updatePlayerState } from "./player.js";
import { initTextStreamer, streamText, clearHighlights } from './textStreamer.js';
import { sm } from "./smStore.js";

// Get DOM element references (done once)
const body = document.body;
const form = getElementById('story-form');
const formInput = getElementById('subject'); // Using the correct ID from your HTML
const playPauseButton = getElementById('generateButton'); // Renamed for clarity
const replayButton = getElementById('replayButton');
const loadingAnimationContainer = getElementById('loadingAnimationContainer');
const chatHistory = getElementById('chatHistory');
const speechAudio = getElementById('speechAudio');
const backgroundAudio = getElementById('backgroundAudio');

document.addEventListener('DOMContentLoaded', () => {
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

  initAudioElements({ speech: speechAudio, background: backgroundAudio });
  initElements_spatial({speech: speechAudio, background: backgroundAudio});
  initLoadingElements(loadingAnimationContainer, loadingAnimation, period1, period2, period3, chatHistory, overlay);
  initTextStreamer(chatHistory, subjectInput);
}) 

form.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Prevent default form submission
    handleAppEvent('submit');
  }
});

// Add Event Listeners
body.addEventListener('keydown', (event) => {
  if (event.code === 'space') {
    // Pause the playing and update the state
    if (appState.playerState === 'playing' && appState.isInputEmpty) {
      updatePlayerState('paused');
      handleAppEvent('playPauseClick');
      updatePlayerUI(appState.playerState);
    }
    else if (appState.playerState === 'paused' && appState.isInputEmpty) {
      updatePlayerState('playing');
      handleAppEvent('playPauseClick');
      updatePlayerUI(appState.playerState);
    }
    return;
  }
});

formInput.addEventListener('input', () => {
  // Update appState and trigger UI update
  appState.isInput = formInput.value.trim().length > 0;
});

playPauseButton.addEventListener('click', () => {
  handleAppEvent('playPauseClick');
});

replayButton.addEventListener('click', () => {
  handleAppEvent('replayClick');
});

// Add listeners for native audio events
speechAudio.addEventListener('play', () => {
  updatePlayerState('playing');
});

speechAudio.addEventListener('pause', () => {
  updatePlayerState('paused');
});

speechAudio.addEventListener('ended', () => {
  // A custom event to handle the end of the story.
  handleAppEvent('speechEnded');
});