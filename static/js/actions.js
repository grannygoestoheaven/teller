import { startNewStoryProcess } from "./storyService.js";

import {
  loadPlayer,
  startSpeech,
  startMusic,
  syncAll,
  pauseAllAudio,
  resumeAllAudio,
} from "./player.js";

import {
  uiIdle,
  initInputAdjustments,
  inputNotEmpty,
  uiLoadingButtons,
  uiPlayingButtons,
  uiClearInput,
  displayRelatedSubjects,
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
    syncAll,
    pauseAllAudio,
    resumeAllAudio,

    // UI Actions
    uiIdle,
    initInputAdjustments,
    inputNotEmpty,
    uiClearInput,
    uiLoadingButtons,
    uiPlayingButtons,
    displayRelatedSubjects,

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