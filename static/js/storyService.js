// storyService.js
import { elements, lastStoryData } from "./config.js";
import { loadPlayer } from "./player.js";
import { sanitizeSubject } from "./utils.js";

let abortController;

export async function startNewStoryProcess() {
  console.log("new story process started");

  abortController = new AbortController();
  const formData = new FormData(elements.form);

  let subject = formData.get('subject');
  subject = sanitizeSubject(subject);
  console.log("Sanitized subject:", subject);

  // Check if story exists
  const responseCheck = await fetch('/v1/stories/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject })
  });

  if (!responseCheck.ok) {
    const errorData = await responseCheck.json();
    throw new Error(errorData.error || `Error ${responseCheck.status}`);
  }

  const { exists, story } = await responseCheck.json();

  if (exists) {
    // If story exists, load it directly
    console.log("Story exists, loading directly:", story);
    Object.assign(lastStoryData, story);
    loadPlayer(lastStoryData);
    return lastStoryData;
  } else {
    // If story does not exist, generate a new one
    const response = await fetch('/v1/stories/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, narrativeStyle: null, difficulty: null }),
      signal: abortController.signal
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}`);
    }

    const newStoryData = await response.json();
    console.log("Full data from backend:", newStoryData);
    Object.assign(lastStoryData, newStoryData);
    loadPlayer(lastStoryData);
    return lastStoryData;
  }
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
