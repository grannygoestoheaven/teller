import { sm } from "smStore.js"
import { initEvents } from "./ui";
import { initPlayer } from ".player.js"

document.addEventListener('DOMContentLoaded', () => {
  
  // ----- Audio elements -----
  const speechAudio = document.getElementById('speechAudio');
  const backgroundAudio = document.getElementById('backgroundAudio')  
  
  // ----- Ui elements -----
  const chatHistory = document.getElementById('chatHistory');
  const loadingAnimationContainer = document.getElementById('loadingAnimationContainer');
  const loadingAnimation = document.getElementById('loadingAnimation');
  const period1 = loadingAnimation.querySelector('.period-1');
  const period2 = loadingAnimation.querySelector('.period-2');
  const period3 = loadingAnimation.querySelector('.period-3');
  
  const form = document.getElementById('storyForm');
  const formInput = document.getElementById('subject');
  const replayBtn = document.getElementById('replayButton');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const stopBtn = document.getElementById('stopButton');
  
  initPlayer({ speech: speechAudio, background: backgroundAudio });
  initEvents(sm, {form, formInput, replayBtn, playPauseBtn, stopBtn}); // wire UI events to State Machine
  initLoadingElements(loadingAnimationContainer, loadingAnimation, period1, period2, period3, chatHistory, overlay);
  initTextStreamer(chatHistory, subjectInput);
  
  // starting the state machine
  sm.start();
}) 


