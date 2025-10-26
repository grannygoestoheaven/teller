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
  initLoadingElements,
  showLoadingAnimation,
  hideLoadingAnimation,
  getRedColor,
  redDots,
  addBlurr,
  removeBlurr,
} from "./animation.js";

import {
  initTextStreamer,
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
    speechAudio: document.getElementById('speechAudio'),
    backgroundAudio: document.getElementById('backgroundAudio'),
    chatHistory: document.getElementById('chatHistory'),
    loadingAnimationContainer: document.getElementById('loadingAnimationContainer'),
    loadingAnimation: document.getElementById('loadingAnimation'),
    form: document.getElementById('story-form'),
    formInput: document.getElementById('subject'),
    replayBtn: document.getElementById('replayBtn'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    stopBtn: document.getElementById('stopBtn'),
  };

  if (elements.loadingAnimation) {
    elements.period1 = elements.loadingAnimation.querySelector('.period-1');
    elements.period2 = elements.loadingAnimation.querySelector('.period-2');
    elements.period3 = elements.loadingAnimation.querySelector('.period-3');
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

  initLoadingElements(elements.chatHistory, elements.loadingAnimationContainer, elements.loadingAnimation, elements.period1, elements.period2, elements.period3);
  initTextStreamer(elements.chatHistory, elements.formInput);
  initInputAdjustments(elements.formInput);

  // start the state machine
  startStateMachine();
});
