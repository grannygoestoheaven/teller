import { elements, getIsGridVisible, setIsGridVisible, getIsChatVisible } from "./config.js";
import { lastStoryData } from "./config.js";

// Topic cycling utility
const topics = [
  'Science', 'Philosophy', 'History', 'Technology', 'Art',
  'Literature', 'Mathematics', 'Psychology', 'Economics',
  'Politics', 'Geography', 'Biology', 'Physics', 'Chemistry',
  'Music', 'Sports', 'Business', 'Medicine', 'Astronomy',
  'Sociology', 'Linguistics', 'Architecture', 'Environmental Studies',
  'Mythology', 'Culinary Arts'
];

let currentTopicIndex = 0;

/**
 * Initialize topic cycling functionality
 */
export function initTopicCycling() {
  // Set initial topic
  if (elements.subtitle) {
    elements.subtitle.textContent = topics[currentTopicIndex];
  }
}

/**
 * Cycle to the next topic
 * @returns {string} The new current topic
 */
export function cycleToNextTopic() {
  currentTopicIndex = (currentTopicIndex + 1) % topics.length;
  
  if (elements.subtitle) {
    elements.subtitle.textContent = topics[currentTopicIndex];
  }
  
  return topics[currentTopicIndex];
}

/**
 * Get the current topic
 * @returns {string} The current topic
 */
export function getCurrentTopic() {
  return topics[currentTopicIndex];
}

/**
 * Set a specific topic by index
 * @param {number} index - The topic index
 */
export function setTopicByIndex(index) {
  if (index >= 0 && index < topics.length) {
    currentTopicIndex = index;
    if (elements.subtitle) {
      elements.subtitle.textContent = topics[currentTopicIndex];
    }
  }
}

/**
 * Get all available topics
 * @returns {Array} Array of all topics
 */
export function getAllTopics() {
  return [...topics];
}

export function uiIdle() {
  // Clear past story
  elements.storyText.innerHTML = '';
  // Reset buttons
  elements.fromStartButton.disabled = true;
  elements.playPauseButton.disabled = true;
  elements.playPauseButton.textContent = 'Start';
  elements.chatHistoryContainer.disabled = !getIsChatVisible();
  inputIsValid();
}

export function initInputAdjustments() {
  const subjectInput = elements.formInput; // Get input from store
  const minHeight = subjectInput.clientHeight;
  const adjustInput = () => {
    subjectInput.style.overflow = 'hidden'
    subjectInput.style.height = 'auto';
    const h = Math.max(subjectInput.scrollHeight, minHeight);
    subjectInput.style.height = h + 'px';
  };
  
  subjectInput.addEventListener('input', adjustInput);
  adjustInput(); // initialize on load
}

// export function inputNotEmpty() {
//   // Access elements from the global store
//   const formInput = elements.formInput;
//   const fromStartButton = elements.fromStartButton;
//   const playPauseButton = elements.playPauseButton;

//   // The logic is now cleaner
//   const isNotEmpty = formInput.value.trim().length > 0;
  
//   if (fromStartButton) {
//       fromStartButton.disabled = !isNotEmpty;
//   }
  
//   if (playPauseButton) {
//       playPauseButton.disabled = !isNotEmpty;
//       // Optional: Set text only when it becomes startable
//       if (isNotEmpty) {
//           playPauseButton.textContent = 'Start new story';
//       }
//   }
// }

export function inputIsValid() {
  return elements.formInput.value.trim().length > 0;
}

export function inputIsEmpty() {
  return elements.formInput.value.trim().length === 0;
}

export function uiReadyButtons() {
  // Enable buttons when input is at least one character long
  elements.fromStartButton.disabled = false;
  elements.playPauseButton.disabled = false;
  elements.chatHistoryContainer.disabled = !getIsChatVisible();
}

export function uiClearInput() {
  // This function only handles the UI change
  elements.formInput.value = ''; 
}

export function uiIdleButtons() {
  elements.fromStartButton.disabled = true;
  elements.playPauseButton.disabled = true;
  elements.playPauseButton.textContent = 'Start';
}

export function uiLoadingButtons() {
  elements.fromStartButton.disabled = true;
  elements.playPauseButton.disabled = true;
  elements.playPauseButton.textContent = 'Loading';
  // elements.formInput.style.display = 'none';
}

export function uiLoadingEnablePause() {
  elements.playPauseButton.disabled = false;
  elements.playPauseButton.textContent = 'Pause';
}

export function uiPlayingButtons() {
  elements.fromStartButton.disabled = false;
  elements.playPauseButton.disabled = false;
  elements.playPauseButton.textContent = 'Pause';
}

export function uiPausedButtons() {
  elements.fromStartButton.disabled = false;
  elements.playPauseButton.disabled = false;
  elements.playPauseButton.textContent = 'Resume';
}

export function showStoryText() {
  // Show text by setting opacity to 1
  elements.chatHistory.style.opacity = 1;
  elements.dotsContainer.style.display = 'none'; 
}

export function hideStoryText() {
  // Hide text by setting opacity to 0 (matches your default CSS)
  elements.chatHistory.style.opacity = 0;
  elements.dotsContainer.style.display = 'flex'; 
}

export function toggleTextVisibility() {
  const isTextVisible = elements.storyText.style.opacity === '1';

  if (isTextVisible) {
      // Hide Text (set opacity to 0) and Show Dots (set display to flex)
      elements.storyText.style.opacity = '0';
      elements.dotsContainer.style.display = 'flex';
  } else {
      // Show Text (set opacity to 1) and Hide Dots (set display to none)
      elements.storyText.style.opacity = '1';
      elements.dotsContainer.style.display = 'none';
  }
}

export function updateStoryText() {
  elements.storyText.innerHTML = lastStoryData.story;
  console.log(elements.storyText.innerHTML);
}

// Toggle function
export function toggleView() {
  const isGridVisible = getIsGridVisible();
  elements.gridContainer.style.display = isGridVisible ? "none" : "grid";
  elements.chatHistoryContainer.style.display = isGridVisible ? "flex" : "none";
  setIsGridVisible(!isGridVisible); // Toggle the state
}
