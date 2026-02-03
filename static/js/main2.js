// import the elements object that will point to all HTML elements
import { elements, getSquaresPerWidth } from "/static/js/config.js";
import { createGridOfSquares, initializeGrid, initTopicCycling, mapValuesToSquares } from "/static/js/uiInit.js";
// import the listeners function to load the state machine events
import { stateMachineEvents, staticListeners } from "/static/js/listeners.js";
// import the actions object that will be assigned to the state machine
import { localActions } from "/static/js/actions.js";

document.addEventListener('DOMContentLoaded', () => {

  // A single object to hold all HTML elements.
  const domElements = {
    title: document.getElementById('teller-title'),
    subtitle: document.getElementById('teller-subtitle'),
    speech: document.getElementById('speechAudio'),
    backgroundTrack: document.getElementById('backgroundAudio'),
    toggleContainer: document.getElementById('toggleContainer'),
    gridContainer: document.getElementById('gridContainer'),
    chatHistoryContainer: document.querySelector('.chat-history'),
    storyText: document.getElementById('story'),
    dotsContainer: document.getElementById('loadingAnimationContainer'),
    dots: document.getElementById('loadingAnimation'),
    form: document.getElementById('storyForm'),
    formInput: document.getElementById('subject'),
    fromStartButton: document.getElementById('replayBtn'),
    playPauseButton: document.getElementById('playPauseBtn'),
    stopButton: document.getElementById('stopBtn'),
    difficultyLevelButton: document.getElementById('difficultyLevelBtn'),
    toggleButton: document.getElementById('toggleBtn')
  };

  if (domElements.storyText) {
    console.log("SUCCESS: Element with ID 'story' was found.");
  } else {
      console.error("FAILURE: Element with ID 'story' was NOT found (is null).");
  }

  // Assign all DOM elements to the 'elements' object
  Object.assign(elements, domElements);
  console.log("MAIN1 ASSIGNMENT: elements.formInput is now:", elements.formInput);

  // Assign loading animation dots if they exist
  if (elements.dots) {
    elements.period1 = domElements.dots.querySelector('.period-1');
    elements.period2 = domElements.dots.querySelector('.period-2');
    elements.period3 = domElements.dots.querySelector('.period-3');
  }

  // Create an instance of the state machine and attach the actions object to it
  const sm = new AudioStateMachine();
  sm.actions = localActions;
  
  createGridOfSquares(getSquaresPerWidth(), sm);
  
  // call the event function to set up event listeners for the state machine
  stateMachineEvents(sm);
  staticListeners(sm);

  // start the state machine
  sm.start();
});
