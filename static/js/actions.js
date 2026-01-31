import { startNewStoryProcess } from "/static/js/storyService.js";

import { getIsGridVisible } from "/static/js/config.js";

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
  bothTracksEnded,
  setBgVolume,
  delaySpeechStart,
  resumeBackgroundOnly
} from "/static/js/player.js";

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
  dotsViewTitle,
  applyDotsViewStyle,
  applyGridViewStyle,
  // activateSquareTextHover,
  // deactivateSquareTextHover
} from "/static/js/ui.js";

import {
  showLoadingAnimation,
  hideLoadingAnimation,
  getRedColor,
  getGreenColor,
  getLoadingColor,
  redDots,
  greenDots,
  loadingDots,
  addBlurr,
  removeBlurr
} from "/static/js/animation.js";

import {
  createGridOfSquares,
  mapValuesToSquares,
  getSquareElements,
} from "/static/js/uiInit.js";

export const localActions = {
    // Story and Process Actions
    startNewStoryProcess,

    // check grid visibility
    getIsGridVisible,

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
    bothTracksEnded,
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
    dotsViewTitle,
    applyDotsViewStyle,
    applyGridViewStyle,
    // activateSquareTextHover,
    // deactivateSquareTextHover,
    
    // Animation Actions
    showLoadingAnimation,
    hideLoadingAnimation,
    getRedColor,
    getGreenColor,
    getLoadingColor,
    redDots,
    greenDots,
    loadingDots,
    addBlurr,
    removeBlurr,

    // Grid Actions
    createGridOfSquares,
    mapValuesToSquares,
    getSquareElements,
  };
