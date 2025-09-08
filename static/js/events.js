// uiEvents.js
export function initEvents(sm) {
  // Grab DOM elements by ID
  
  const replayBtn = document.getElementById("replayBtn");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const stopBtn = document.getElementById("stopBtn");
  const speechAudio = document.getElementById('speechAudio');
  const backgroundAudio = document.getElementById('backgroundAudio');
  
  const chatHistory = document.getElementById('chatHistory');
  const loadingAnimationContainer = document.getElementById('loadingAnimationContainer');
  const form = document.getElementById('story-form');
  const formInput = document.getElementById('subject'); 
  const subjectPlaceholder = document.document.getElementById('subjectPlaceholder');// after you grab subjectInput…
  
  const overlay = document.querySelector('.blur-overlay');

  window.addEventListener('keydown', (event) => {
    if (event.code === 'space') {
      sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
    }
  });

  form?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default form submission
      sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
    }
  });

  formInput?.addEventListener('input', () => {
    // Adjust height based on content
    formInput.style.height = 'auto';
    formInput.style.height = `${Math.max(formInput.scrollHeight, formInput.clientHeight)}px`;
    // Toggle placeholder visibility
    subjectPlaceholder.style.display = formInput.value ? 'none' : 'block';
  });

  speechAudio?.addEventListener('canplaythrough', () => {
    sm.dispatchEvent(AudioSm.EventId.SPEECH_READY);
  });

  playPauseBtn?.addEventListener("click", () => {
    sm.dispatchEvent(AudioSm.EventId.PLAY_BTN_CLICKED);
  });
  
  replayBtn?.addEventListener("click", () => {
    sm.dispatchEvent(AudioSm.EventId.REPLAY);
  });

  stopBtn?.addEventListener("click", () => {
    sm.dispatchEvent(AudioSm.EventId.CANCEL);
  });

}
