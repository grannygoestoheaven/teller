import { AudioController } from "./AudioController.js";

document.addEventListener('DOMContentLoaded', () => {

  // A single object to hold all HTML elements.
  const elements = {
    speechAudio: document.getElementById('speechAudio'),
    backgroundAudio: document.getElementById('backgroundAudio'),
    chatHistory: document.getElementById('chatHistory'),
    loadingAnimationContainer: document.getElementById('loadingAnimationContainer'),
    loadingAnimation: document.getElementById('loadingAnimation'),
    period1: loadingAnimation.querySelector('.period-1'),
    period2: loadingAnimation.querySelector('.period-2'),
    period3: loadingAnimation.querySelector('.period-3'),
    form: document.getElementById('story-form'),
    formInput: document.getElementById('subject'),
    replayBtn: document.getElementById('replayBtn'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    stopBtn: document.getElementById('stopBtn'),
  };

  if (elements.loadingAnimation) {
    elements.period1 = elements.loadingAnimation.querySelector('.period-1');
    elements.period2 = elements.loadingAnimation.querySelector('.period-2');
    elements.period3 = elements.loadingAnimation.querySelector('.period-3');
  }

  // Create an instance of the controller.
  const controller = new AudioController(elements);

  // Tell it to start!
  controller.start();
});
