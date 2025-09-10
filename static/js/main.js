import { createSm } from "smStore.js"
import { initPlayer, startSpeech, startMusic, syncAll } from ".player.js"
import { initControlEvents } from "./ui";
import { 
  initLoadingElements, 
  showLoadingAnimation, 
  hideLoadingAnimation, 
  getRedColor, 
  redDots, 
  addBlurr, 
  removeBlurr 
} from './loadingAnimation.js';
import {
  initTextStreamer,
  streamText,
  handleWordClick,
  handleMouseMove,
  handleMouseOut,
  findNextWordSpan,
  clearHighlights
} from "./textStreamer.js";

document.addEventListener('DOMContentLoaded', () => {
  
  // ----- Audio elements -----
  const speechAudio = document.getElementById('speechAudio');
  const backgroundAudio = document.getElementById('backgroundAudio')  
  
  // ----- Chat & animation ----- 
  const chatHistory = document.getElementById('chatHistory');
  const loadingAnimationContainer = document.getElementById('loadingAnimationContainer');
  const loadingAnimation = document.getElementById('loadingAnimation');
  const period1 = loadingAnimation.querySelector('.period-1');
  const period2 = loadingAnimation.querySelector('.period-2');
  const period3 = loadingAnimation.querySelector('.period-3');
  
  // ----- Form -----
  const form = document.getElementById('storyForm');
  const formInput = document.getElementById('subject');

  // ----- Controls -----
  const replayBtn = document.getElementById('replayButton');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const stopBtn = document.getElementById('stopButton');

  // ----- Init functions -----
  initPlayer({ speech: speechAudio, background: backgroundAudio });
  initControlEvents(sm, {form, formInput, replayBtn, playPauseBtn, stopBtn}); // wire UI events to State Machine
  initLoadingElements(chatHistory, loadingAnimationContainer, loadingAnimation, period1, period2, period3);
  initTextStreamer(chatHistory, subjectInput);

  // ----- Ui functions -----
  showLoadingAnimation();
  hideLoadingAnimation();
  getRedColor();
  redDots();
  addBlurr();
  removeBlurr();

  // ----- Text streaming functions -----
  streamText();
  handleWordClick();
  handleMouseMove();
  handleMouseOut();
  findNextWordSpan();
  clearHighlights();
  
  // starting the state machine
  sm.start();
})