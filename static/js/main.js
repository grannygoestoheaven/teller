import { sm } from "smStore.js"
import { initEvents } from "./ui";
import { initPlayer } from ".player.js"

document.addEventListener('DOMContentLoaded', () => {
  // ----- Audio elements -----
  const speechAudio = document.getElementById('speechAudio');
  const backgroundAudio = document.getElementById('backgroundAudio')  

  // ----- Ui elements -----
  const chatHistory = document.getElementById('chatHistory');
  const subjectInput = document.getElementById('subject');
  const minHeight = subjectInput.clientHeight; // capture its one-line default
  const adjustSubjectHeight = () => {
    subjectInput.style.height = 'auto';
    const h = Math.max(subjectInput.scrollHeight, minHeight);
    subjectInput.style.height = h + 'px';
  };
  subjectInput.addEventListener('input', adjustSubjectHeight);
  adjustSubjectHeight();
  const loadingAnimationContainer = document.getElementById('loadingAnimationContainer');
  const loadingAnimation = document.getElementById('loadingAnimation');
  const period1 = loadingAnimation.querySelector('.period-1');
  const period2 = loadingAnimation.querySelector('.period-2');
  const period3 = loadingAnimation.querySelector('.period-3');
  
  const replayBtn = document.getElementById('replayButton');
  const playPauseteBtn = document.getElementById('playPauseBtn');
  const stopBtn = document.getElementById('stopButton');

  initAudioElements({ speech: speechAudio, background: backgroundAudio });
  initElements_spatial({speech: speechAudio, background: backgroundAudio});
  initLoadingElements(loadingAnimationContainer, loadingAnimation, period1, period2, period3, chatHistory, overlay);
  initTextStreamer(chatHistory, subjectInput);
}) 


sm.start();
initEvents(sm); // wire UI events to SM

