import { events, startOrRestartNewStory } from "./listeners.js";
import { handleStateChange as states_handleStateChange } from "./states.js";

import { startNewStoryProcess } from "./storyService.js";

import {
  loadPlayer,
  startSpeech,
  startMusic,
  syncAll,
  pauseAllAudio,
  resumeAllAudio,
} from "./player.js";

import { uiIdle, initInputAdjustments, inputNotEmpty } from "./ui.js";

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

export class AudioController {
    #sm;
    #actions;
  
    constructor(elements) {
      // 1. Call the initialization functions first.
      // This sets up the UI elements before anything else happens.
      initLoadingElements(elements.chatHistory, elements.loadingAnimationContainer, elements.loadingAnimation, elements.period1, elements.period2, elements.period3);
      initTextStreamer(elements.chatHistory, elements.formInput);
      initInputAdjustments(elements.formInput);
  
      // 2. The 'body' or 'interface' object.
      // This object contains only the functions that the state machine will call.
      this.#actions = {
        ...elements,
        startNewStoryProcess,
        startOrRestartNewStory,
        loadPlayer,
        startSpeech,
        startMusic,
        syncAll,
        pauseAllAudio,
        resumeAllAudio,
        uiIdle: () => uiIdle(elements.chatHistory, elements.replayBtn, elements.playPauseBtn),
        inputNotEmpty: () => inputNotEmpty(elements.playPauseBtn, elements.replayBtn, elements.stopBtn, elements.formInput),
        showLoadingAnimation,
        hideLoadingAnimation,
        getRedColor,
        redDots,
        addBlurr,
        removeBlurr,
        streamText,
        handleWordClick,
        handleMouseMove,
        handleMouseOut,
        findNextWordSpan,
        clearHighlights,
      };
  
      // ... (rest of the constructor code remains the same)
      this.#sm = new AudioSm();
      this.#sm.actions = this.#actions;
  
      const originalDispatch = this.#sm.dispatchEvent.bind(this.#sm);
      this.#sm.dispatchEvent = (eventId) => {
        const prevStateId = this.#sm.stateId;
        originalDispatch(eventId);
        const newStateId = this.#sm.stateId;
        if (prevStateId !== newStateId) {
          states_handleStateChange(this.#sm, newStateId);
        }
      };
  
      events(this.#sm, elements);
    }
  
    start() {
      this.#sm.start();
    }
  }
  