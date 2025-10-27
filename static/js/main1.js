import { startStateMachine } from "./startStateMachine.js";
import { elements, actions } from "./config.js";

import { startOrRestartNewStory } from "./listeners.js";
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

  if (elements.dots) {
    elements.period1 = domElements.dots.querySelector('.period-1');
    elements.period2 = domElements.dots.querySelector('.period-2');
    elements.period3 = domElements.dots.querySelector('.period-3');
  }

  Object.assign(elements, domElements);

  Object.assign(actions, {
    // Story and Process Actions
    startNewStoryProcess: startNewStoryProcess,
    startOrRestartNewStory: startOrRestartNewStory,

    // Player Actions
    loadPlayer: loadPlayer,
    startSpeech: startSpeech,
    startMusic: startMusic,
    syncAll: syncAll,
    pauseAllAudio: pauseAllAudio,
    resumeAllAudio: resumeAllAudio,

    // UI Actions
    uiIdle: uiIdle,
    inputNotEmpty: inputNotEmpty,
    uiLoadingButtons: uiLoadingButtons,
    uiPlayingButtons: uiPlayingButtons,

    // Animation Actions
    showLoadingAnimation: showLoadingAnimation,
    hideLoadingAnimation: hideLoadingAnimation,
    getRedColor: getRedColor,
    redDots: redDots,
    addBlurr: addBlurr,
    removeBlurr: removeBlurr,

    // Text Streamer Actions
    streamText: streamText,
    handleWordClick: handleWordClick,
    handleMouseMove: handleMouseMove,
    handleMouseOut: handleMouseOut,
    findNextWordSpan: findNextWordSpan,
    clearHighlights: clearHighlights,
  });
  // Adjusting input field
  initInputAdjustments();

  // start the state machine
  startStateMachine();
});
