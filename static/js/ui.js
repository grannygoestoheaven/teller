import { elements, gridSize } from "./config.js";
import { lastStoryData } from "./config.js";

export function uiIdle() {
  // Clear past story
  elements.storyText.innerHTML = '';
  // Reset buttons
  elements.fromStartButton.disabled = true;
  elements.playPauseButton.disabled = true;
  elements.playPauseButton.textContent = 'Start';
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
 export function toggleView(isGridVisible) {
  console.log("toggleView called!"); // Debug log
  elements.gridContainer.style.display = isGridVisible ? "grid" : "none";
  elements.chatHistory.style.display = isGridVisible ? "none" : "block";
  elements.gridContainer.style.pointerEvents = isGridVisible ? "auto" : "none";
  elements.chatHistory.style.pointerEvents = isGridVisible ? "none" : "auto";
}

export function createGridOfSquares(gridSize) {
  let squarecount = (gridSize * gridSize);
  console.log(squarecount);
  elements.gridContainer.style.display = 'grid';
  elements.gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  elements.gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  // let's fill the grid
  for(let i = 0; i < squarecount; i++)
  {
      const squareDiv = document.createElement('div');
      squareDiv.classList.add('square');
      squareDiv.textContent = '';
      elements.gridContainer.append(squareDiv);
  }
}

export function removeLastGrid(grid) {
  while (grid.lastChild) {
      grid.removeChild(grid.lastChild);
  };
}

// Function to resize the grid (call this when needed)
export function resizeGrid(newSize) {
  gridSize = newSize;
  createGridOfSquares(newSize);
}
