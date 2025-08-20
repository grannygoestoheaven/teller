import { handleAudioPlayback } from "./audioControls3";
import { handleAppEvent, updatePlayerState } from "./player.js";
import { initTextStreamer, streamText, clearHighlights } from './textStreamer.js';

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

// Define the central state object
const appState = {
    playerState: 'idle',
    formIsNotEmpty: false,
  };

initAudioElements({ speech: speechAudio, background: backgroundAudio });
initElements_spatial({speech: speechAudio, background: backgroundAudio});
initLoadingElements(loadingAnimationContainer, loadingAnimation, period1, period2, period3, chatHistory, overlay);
initTextStreamer(chatHistory, subjectInput);

// Add Event Listeners
document.addEventListener('keydown', (event) => {
  if (event.code === 'Escape') {
    // Pause the playing and update the state
    if (appState.playerState === 'playing') {
      updatePlayerState('paused');
      handleAppEvent('playPauseClick');
      updatePlayerUI(appState.playerState);
      updateFormUI(appState.formIsNotEmpty);
    }
    return;
  }
});
form.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default form submission
      handleUserAction('submit');
    }
});
formInput.addEventListener('input', () => {
  // Update appState and trigger UI update
  appState.formIsNotEmpty = formInput.value.trim().length > 0;
  updateFormUI(appState);
});

playPauseButton.addEventListener('click', () => {
  handleUserAction('playPauseClick');
});

replayButton.addEventListener('click', () => {
  handleUserAction('replayClick');
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
  handleUserAction('speechEnded');
});