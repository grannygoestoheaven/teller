// storyService.js
import { elements } from "./config.js";

let abortController;
let lastStoryData = {};

export async function startNewStoryProcess() {

  console.log("new story process started");
  abortController = new AbortController();
  const formData = new FormData(elements.form);

  const subject = formData.get('subject').trim();
  formData.set('subject', subject);

  lastStoryData = data

  // elements.formInput.value = ''; // Clear input field immediately

  // Fetch story from backend
  const res = await fetch('/generate_story', { method: 'POST', body: formData, signal:abortController.signal });
  if (!res.ok) throw new Error((await res.json()).error || `Error ${res.status}`);
  const data = await res.json();

  // Set all relevant keys from the backend response
  // lastStoryData.cleanStory = data.story;
  // lastStoryData.taggedStory = data.tagged_story;
  // lastStoryData.fileName = data.display_filename;
  // lastStoryData.hasAudio = data.has_audio;
  // lastStoryData.timestamp = Date.now(); // Or use a timestamp from 'data' if the backend provides one

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
