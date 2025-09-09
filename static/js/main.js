import { sm } from "smStore.js"
import { initPlayer } from ".player.js"
import { initControlEvents } from "./ui";
import { initLoadingElements } from "./loadingAnimation.js";

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
  
  initPlayer({ speech: speechAudio, background: backgroundAudio });
  initControlEvents(sm, {form, formInput, replayBtn, playPauseBtn, stopBtn}); // wire UI events to State Machine
  initLoadingElements(chatHistory, loadingAnimationContainer, loadingAnimation, period1, period2, period3);
  initTextStreamer(chatHistory, subjectInput);
  
  // starting the state machine
  sm.start();
}) 
