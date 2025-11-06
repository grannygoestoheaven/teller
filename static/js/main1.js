import { elements } from "./config.js";
import { events } from "./listeners.js";

import { localActions } from "./actions.js";

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
    fromStartButton: document.getElementById('replayBtn'),
    playPauseButton: document.getElementById('playPauseBtn'),
    stopButton: document.getElementById('stopBtn'),
  };

  Object.assign(elements, domElements);
  console.log("MAIN1 ASSIGNMENT: elements.formInput is now:", elements.formInput);

  if (elements.dots) {
    elements.period1 = domElements.dots.querySelector('.period-1');
    elements.period2 = domElements.dots.querySelector('.period-2');
    elements.period3 = domElements.dots.querySelector('.period-3');
  }

  const sm = new AudioSm();
  sm.actions = localActions;

  events(sm);

  // Adjusting input field
  initInputAdjustments();

  // start the state machine
  sm.start();
});
