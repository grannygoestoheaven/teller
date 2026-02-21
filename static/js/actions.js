import { generateSubjectsListFromTopic, addTitleToSquare, squareHasTitle, pasteSquareTitleInInput } from "/static/js/subjectsService.js";
import { startNewStoryProcess, startNewStoryProcessForm, abortProcess } from "/static/js/storyService.js";
import { getIsGridVisible, getIsGridFilled } from "/static/js/config.js";

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
  initInputAdjustments,
  inputIsValid,
  inputIsEmpty,
  uiIdleButtons,
  uiLoadingButtons,
  uiPlayingButtons,
  uiClearInput,
  uiReadyButtons,
  uiPausedButtons,
  uiLoadingEnablePause,
  clearStoryText,
  showText,
  hideText,
  toggleTextVisibility,
  updateStoryText,
  toggleView,
  dotsView,
  gridView,
  textView,
  lockGrid,
  unlockGrid,
  dotsViewTitle,
  applyDotsViewStyle,
  applyGridViewStyle,
  // addSquareToPlayed,
  // removeSquareFromPlayed,
  fixSquareColor,
  removeFixedColorFromSquare,
  // activateSquareTextHover,
  // deactivateSquareTextHover
} from "/static/js/ui.js";

import {
  displayStoryText
}
from "/static/js/textDisplay.js";

import {
  wrapWordsInSpans,
}
from "/static/js/textInteractionSystem.js";

import {
  // showLoadingAnimation,
  // hideLoadingAnimation,
  getRedColor,
  getGreenColor,
  getLoadingColor,
  redDots,
  greenDots,
  blueDots,
  loadingDots,
  addBlurr,
  removeBlurr,
  addBorderToInput
} from "/static/js/animation.js";

import {
  createGridOfSquares,
  mapValuesToSquares,
  getSquareElements,
} from "/static/js/uiInit.js";

export const localActions = {
    // Story and Process Actions
    generateSubjectsListFromTopic,
    addTitleToSquare,
    squareHasTitle,
    pasteSquareTitleInInput,
    startNewStoryProcess,
    startNewStoryProcessForm,
    abortProcess,

    // check grid visibility
    getIsGridVisible,
    getIsGridFilled,

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
    initInputAdjustments,
    inputIsValid,
    inputIsEmpty,
    uiIdleButtons,
    uiReadyButtons,
    uiLoadingButtons,
    uiPlayingButtons,
    uiClearInput,
    uiPausedButtons,
    uiLoadingEnablePause,
    clearStoryText,
    showText,
    hideText,
    toggleTextVisibility,
    updateStoryText,
    toggleView,
    dotsView,
    gridView,
    textView,    
    lockGrid,
    unlockGrid,
    dotsViewTitle,
    applyDotsViewStyle,
    applyGridViewStyle,
    // addSquareToPlayed,
    // removeSquareFromPlayed,
    fixSquareColor,
    removeFixedColorFromSquare,
    // activateSquareTextHover,
    // deactivateSquareTextHover,

    // Text Display Actions
    displayStoryText,
    wrapWordsInSpans,
    
    // Animation Actions
    // showLoadingAnimation,
    // hideLoadingAnimation,
    getRedColor,
    getGreenColor,
    getLoadingColor,
    redDots,
    greenDots,
    blueDots,
    loadingDots,
    addBlurr,
    removeBlurr,
    addBorderToInput,

    // Grid Actions
    createGridOfSquares,
    mapValuesToSquares,
    getSquareElements,
  };
