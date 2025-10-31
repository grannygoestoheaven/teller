// storyService.js
import { elements } from "./config.js";
console.log("STORYSERVICE IMPORT: elements.formInput is:", elements.formInput);
// Expected to be 'undefined' if it's loading a stale reference.

let abortController;

export async function startNewStoryProcess() {

  console.log("new story process started");
  abortController = new AbortController();
  const formData = new FormData(elements.form);

  // Get subject
  const subjectValue = elements.formInput.value.trim();

  // 3. Overwrite the 'subject' entry in FormData
  if (subjectValue.length > 0) {
    formData.set('subject', subjectValue); // Update FormData with trimmed subject - Bypassing the formData constructor issue.
  } else {
    console.error("Subject is empty, process aborted.");
    return; 
  }

  // const subject = formData.get('subject').trim();
  // formData.set('subject', subject);

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

  // You can still keep these helpers if needed
  // function clearPlaybackTimers(speechAudio, backgroundAudio) {
  //   // Implementation to clear any active timers
  //   clearInterval(speechAudio._fadeInterval);
  //   clearInterval(backgroundAudio._fadeInterval);
  //   clearTimeout(bgFadeTimeout);
  //   clearTimeout(bgFadeOutTimeout);
  // }
  
  // function saveStoryToStorage(storyObj) {
  //   localStorage.setItem('lastStory', JSON.stringify(storyObj));
  // }
