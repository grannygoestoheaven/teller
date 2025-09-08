import { AudioSm } from "./state.js";
import { sm } from "./smStore.js";

// Get DOM element references (done once)
document.addEventListener('DOMContentLoaded', () => {
const body = document.body;
const chatHistory = document.getElementById('chatHistory');
const loadingAnimationContainer = document.getElementById('loadingAnimationContainer');
const overlay = document.querySelector('.blur-overlay');
const form = document.getElementById('story-form');
const formInput = document.getElementById('subject'); // Using the correct ID from your HTML
const subjectPlaceholder = document.document.getElementById('subjectPlaceholder');// after you grab subjectInput…
subjectInput.style.overflow = 'hidden';
subjectInput.style.height   = 'auto';
const playPauseButton = document.getElementById('generateButton'); // Renamed for clarity
const replayButton = document.getElementById('replayButton');
const speechAudio = document.getElementById('speechAudio');
const backgroundAudio = document.getElementById('backgroundAudio');
});

document.addEventListener('DOMContentLoaded', () => {
  const chatHistory = document.getElementById('chatHistory');
  const subjectInput = document.getElementById('subject');
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
window.addEventListener('keydown', (event) => {
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

