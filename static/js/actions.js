import { startNewStoryProcess } from "./storyService.js";

import {
  loadPlayer,
  startSpeech,
  startMusic,
  setUpAndStartAllAudio,
  stopAndResetAllAudio,
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
  updateStoryText,
  toggleView,

} from "./ui.js";

import {
  showLoadingAnimation,
  hideLoadingAnimation,
  getRedColor,
  getGreenColor,
  redDots,
  greenDots,
  addBlurr,
  removeBlurr,
} from "./animation.js";

import {
  createGridOfSquares,
  mapValuesToSquares,
  getSquareElements,
  lockTitleSend,
  unlockTitleSend
} from "./squaresAndSubjects.js";

export const localActions = {
    // Story and Process Actions
    startNewStoryProcess,

    // Player Actions
    loadPlayer,
    startSpeech,
    startMusic,
    setUpAndStartAllAudio,
    stopAndResetAllAudio,
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
    updateStoryText,
    toggleView,
    
    // Animation Actions
    showLoadingAnimation,
    hideLoadingAnimation,
    getRedColor,
    getGreenColor,
    redDots,
    greenDots,
    addBlurr,
    removeBlurr,

    // Grid Actions
    createGridOfSquares,
    mapValuesToSquares,
    getSquareElements,
    lockTitleSend,
    unlockTitleSend
  };
