// storyService.js
import { elements } from "./config.js";

let abortController;
let lastStoryData = {};

export async function startNewStoryProcess() {

  console.log("new story process started"); // Diagnostic log

  abortController = new AbortController();
  const formData = new FormData(elements.form);

  const subject = formData.get('subject').trim();
  formData.set('subject', subject);

  // elements.formInput.value = ''; // Clear input field immediately

  // Fetch story and corresponding TTS from backend
  const response = await fetch('/generate_story', { method: 'POST', body: formData, signal:abortController.signal });
  if (!response.ok) throw new Error((await response.json()).error || `Error ${response.status}`);
  const data = await response.json();

  lastStoryData = data // contains the story text, the corresponding audio URL (TTS file) and the background track

  console.log(data);

  return data;
  }

  export function getLastStoryData() {
    return lastStoryData;
  }

  export function clearPlaybackTimers() {
    // Implementation to clear any active timers
    // clearInterval(speech._fadeInterval);
    clearInterval(backgrounTrack._fadeInterval);
    // clearTimeout(bgFadeTimeout);
    clearTimeout(bgFadeOutTimeout);
  }
  
  export function saveStoryToStorage(storyObj) {
    localStorage.setItem('lastStory', JSON.stringify(storyObj));
  }

  export function abortProcess() {
    abortController?.abort(); // cancels the fetch if still pending
  }
