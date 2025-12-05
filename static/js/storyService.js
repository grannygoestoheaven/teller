// storyService.js
import { elements, lastStoryData } from "./config.js";
import { loadPlayer } from "./player.js";
import { sanitizeSubject } from "./utils.js";

let abortController;

export async function startNewStoryProcess() {
  console.log("new story process started");
  abortController = new AbortController(); // Abort any ongoing fetch

  const formData = new FormData(elements.form); // Collect form data
  let subject = formData.get('subject');

  subject = sanitizeSubject(subject) // get a formatted subject with underscores to send to the backend
  console.log("Sanitized subject:", subject);
  
  // ================= SENDS REQUEST TO BACKEND =================
  
  // checking if story exists - request sent to the backend at src/routers/story/@router.post("/check")
  const responseCheck = await fetch('/v1/stories/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject })
  }); 

  const { exists, data } = await responseCheck.json(); // destructure response - bool, story object

  if (!exists) {
    // if story does not exist, generate a new one
    const response = await fetch('/v1/stories/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject }),
    signal:abortController.signal });
  
  // ==================== HANDLES RESPONSE ======================
  
    // Handle non-OK responses
    if (!response.ok) throw new Error((await response.json()).error || `Error ${response.status}`);
  
    const data = await response.json();
    console.log("Full data from backend:", data);
  
    // Store the last story data for playback - contains story text, audio URLs for TTS file and background track
    Object.assign(lastStoryData, data)
    console.log(lastStoryData.cleanStory);
  
    // Load the player with new story data here for safety
    loadPlayer(lastStoryData); // The audio sources are now loaded from the lastStoryData object
  
    return lastStoryData;
    }

  // If story exists, load it directly
  if (!responseCheck.ok) throw new Error((await response.json()).error || `Error ${response.status}`);
  
  console.log("Full data from backend:", data);
  Object.assign(lastStoryData, data);
  loadPlayer(lastStoryData);

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
