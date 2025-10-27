import { events, startOrRestartNewStory } from "./listeners.js";
import { handleStateChange } from "./states.js";
import { startNewStoryProcess } from "./storyService.js";

import {
  loadPlayer,
  startSpeech,
  startMusic,
  syncAll,
  pauseAllAudio,
  resumeAllAudio,
} from "./player.js";

import { uiIdle, initInputAdjustments, inputNotEmpty, uiLoadingButtons, uiPlayingButtons } from "./ui.js";

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
        uiLoadingButtons: () => uiLoadingButtons(elements.playPauseBtn),
        uiPlayingButtons: () => uiPlayingButtons(elements.speechAudio, elements.backgroundAudio),
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
      this.#sm = new AudioSm(); // the class is included in the html file, so we can call it here.
      this.#sm.actions = this.#actions;
  
      const originalDispatch = this.#sm.dispatchEvent.bind(this.#sm);
      this.#sm.dispatchEvent = (eventId) => {
        const prevStateId = this.#sm.stateId;
        originalDispatch(eventId);
        const newStateId = this.#sm.stateId;

        console.log('Event:', AudioSm.eventIdToString(eventId));
        console.log('Prev State:', AudioSm.stateIdToString(prevStateId));
        console.log('New State:', AudioSm.stateIdToString(newStateId));

        if (prevStateId !== newStateId) {
          handleStateChange(this.#sm, newStateId);
        }
      };
  
      events(this.#sm, elements);
    }
  
    start() {
      this.#sm.start();
    }
  }

