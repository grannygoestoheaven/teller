// storyService.js
import { elements, lastStoryData } from "./config.js";
import { loadPlayer } from "./player.js";

let abortController;
// let lastStoryData = {};

export async function startNewStoryProcess() {
  // Diagnostic log
  console.log("new story process started");
  // Abort any ongoing fetch
  abortController = new AbortController();
  // Collect form data
  const formData = new FormData(elements.form);
  // Trim whitespace from subject input
  const subject = formData.get('subject').trim();
  formData.set('subject', subject);
  // elements.formInput.value = ''; // Clear input field immediately

  // Fetch story and corresponding TTS from backend
  const response = await fetch('/generate_story', { method: 'POST', body: formData, signal:abortController.signal });
  // Handle non-OK responses
  if (!response.ok) throw new Error((await response.json()).error || `Error ${response.status}`);
  const data = await response.json();
  console.log("Full data from backend:", data);
  // Store the last story data for playback - contains story text, audio URLs for TTS file and background track
  Object.assign(lastStoryData, data)
  // Diagnostic log
  console.log(lastStoryData.cleanStory);
  // Load the player with new story data here for safety
  loadPlayer(lastStoryData);

  return lastStoryData ;
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
