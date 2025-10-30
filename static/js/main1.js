import { startStateMachine } from "./startStateMachine.js";
import { elements } from "./config.js";

import { events, startOrRestartNewStory } from "./listeners.js";
import { startNewStoryProcess } from "./storyService.js";

import {
  loadPlayer,
  startSpeech,
  startMusic,
  syncAll,
  pauseAllAudio,
  resumeAllAudio,
} from "./player.js";

import { uiIdle,
  initInputAdjustments,
  inputNotEmpty,
  uiLoadingButtons,
  uiPlayingButtons,
} from "./ui.js";

import {
  showLoadingAnimation,
  hideLoadingAnimation,
  getRedColor,
  redDots,
  addBlurr,
  removeBlurr,
} from "./animation.js";

import {
  streamText,
  handleWordClick,
  handleMouseMove,
  handleMouseOut,
  findNextWordSpan,
  clearHighlights,
} from "./textStreamer.js";

document.addEventListener('DOMContentLoaded', () => {

  // A single object to hold all HTML elements.
  const domElements = {
    speech: document.getElementById('speechAudio'),
    backgroundTrack: document.getElementById('backgroundAudio'),
    storyText: document.getElementById('chatHistory'),
    dotsContainer: document.getElementById('loadingAnimationContainer'),
    dots: document.getElementById('loadingAnimation'),
    form: document.getElementById('story-form'),
    formInput: document.getElementById('subject'),
    replayButton: document.getElementById('replayBtn'),
    playPauseButton: document.getElementById('playPauseBtn'),
    stopButton: document.getElementById('stopBtn'),
  };

  Object.assign(elements, domElements);

  if (elements.dots) {
    elements.period1 = domElements.dots.querySelector('.period-1');
    elements.period2 = domElements.dots.querySelector('.period-2');
    elements.period3 = domElements.dots.querySelector('.period-3');
  }

  const localActions = {
    // Story and Process Actions
    startNewStoryProcess,
    startOrRestartNewStory,

    // Player Actions
    loadPlayer,
    startSpeech,
    startMusic,
    syncAll,
    pauseAllAudio,
    resumeAllAudio,

    // UI Actions
    uiIdle,
    inputNotEmpty,
    uiLoadingButtons,
    uiPlayingButtons,

    // Animation Actions
    showLoadingAnimation,
    hideLoadingAnimation,
    getRedColor,
    redDots,
    addBlurr,
    removeBlurr,

    // Text Streamer Actions
    streamText,
    handleWordClick,
    handleMouseMove,
    handleMouseOut,
    findNextWordSpan,
    clearHighlights,
  };

  const sm = new AudioSm();
  sm.actions = localActions;

  events(sm);

  // Adjusting input field
  initInputAdjustments();

  // start the state machine
  startStateMachine(sm);
});
