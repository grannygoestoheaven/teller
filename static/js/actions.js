import { startNewStoryProcess } from "./storyService.js";

import {
  loadPlayer,
  startSpeech,
  startMusic,
  setUpAndStartAllAudio,
  syncAll,
  pauseAllAudio,
  resumeAllAudio,
  resetAllAudio,
  setBgVolume,
  delaySpeechStart,
  resumeBackgroundOnly,
} from "./player.js";

import {
  uiIdle,
  initInputAdjustments,
  inputIsValid,
  inputIsEmpty,
  uiLoadingButtons,
  uiPlayingButtons,
  uiClearInput,
  uiReadyButtons,
  uiPausedButtons,
  uiLoadingEnablePause,
  showStoryText,
  hideStoryText,
  toggleTextVisibility,

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

export const localActions = {
    // Story and Process Actions
    startNewStoryProcess,

    // Player Actions
    loadPlayer,
    startSpeech,
    startMusic,
    setUpAndStartAllAudio,
    syncAll,
    pauseAllAudio,
    resumeAllAudio,
    resetAllAudio,
    setBgVolume,
    delaySpeechStart,
    resumeBackgroundOnly,

    // UI Actions
    uiIdle,
    initInputAdjustments,
    inputIsValid,
    inputIsEmpty,
    uiClearInput,
    uiReadyButtons,
    uiLoadingButtons,
    uiPlayingButtons,
    uiPausedButtons,
    uiLoadingEnablePause,
    showStoryText,
    hideStoryText,
    toggleTextVisibility,
    
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