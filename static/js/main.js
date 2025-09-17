import { AudioController } from "./AudioController.js";

document.addEventListener('DOMContentLoaded', () => {

  // A single object to hold all your HTML elements.
  const elements = {
    speechAudio: document.getElementById('speechAudio'),
    backgroundAudio: document.getElementById('backgroundAudio'),
    chatHistory: document.getElementById('chatHistory'),
    loadingAnimationContainer: document.getElementById('loadingAnimationContainer'),
    loadingAnimation: document.getElementById('loadingAnimation'),
    period1: loadingAnimation.querySelector('.period-1'),
    period2: loadingAnimation.querySelector('.period-2'),
    period3: loadingAnimation.querySelector('.period-3'),
    form: document.getElementById('storyForm'),
    formInput: document.getElementById('subject'),
    replayBtn: document.getElementById('replayBtn'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    stopBtn: document.getElementById('stopBtn'),
  };

  // Create an instance of your new controller.
  const controller = new AudioController(elements);

  // Tell it to start!
  controller.start();
});