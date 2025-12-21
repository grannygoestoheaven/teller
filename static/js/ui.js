import { elements, getIsGridVisible, setIsGridVisible } from "./config.js";
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
export function toggleView() {
  const isGridVisible = getIsGridVisible();
  elements.gridContainer.style.display = isGridVisible ? "grid" : "none";
  elements.chatHistoryContainer.style.display = isGridVisible ? "none" : "flex";
  setIsGridVisible(!isGridVisible); // Toggle the state
}

export function createGridOfSquares2_1(squaresPerWidth) {
  const containerWidth = elements.toggleContainer.clientWidth;
  const squareSize = containerWidth / squaresPerWidth; // Square size based on width
  const rows = Math.floor((containerWidth / 2) / squareSize); // Rows based on height (2:1 ratio)

  elements.gridContainer.style.gridTemplateColumns = `repeat(${squaresPerWidth}, ${squareSize}px)`;
  elements.gridContainer.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

  elements.gridContainer.innerHTML = '';
  const squareCount = squaresPerWidth * rows;
  for (let i = 0; i < squareCount; i++) {
    const squareDiv = document.createElement('div');
    squareDiv.classList.add('square');
    elements.gridContainer.append(squareDiv);
  }
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

export function create2freeGridOfSquares(gridSize) {
  const containerWidth = elements.toggleContainer.clientWidth;
  const containerHeight = elements.toggleContainer.clientHeight;

  // Calculate the aspect ratio of the container
  const aspectRatio = containerWidth / containerHeight;

  // Apply the aspect ratio to the grid template
  elements.gridContainer.style.gridTemplateColumns = `repeat(${gridSize * 2}, 1fr)`;
  elements.gridContainer.style.gridTemplateRows = `repeat(${gridSize / 2}, 2fr)`;

  elements.gridContainer.innerHTML = '';
  const squareCount = gridSize * gridSize;

  for (let i = 0; i < squareCount; i++) {
    const squareDiv = document.createElement('div');
    squareDiv.classList.add('square');
    elements.gridContainer.append(squareDiv);
  }
}

export function createFreeGridOfSquares(gridSize) {
  const containerWidth = elements.gridContainer.clientWidth;
  const squareSize = containerWidth / gridSize;
  const rows = Math.floor(elements.gridContainer.clientHeight / squareSize);

  // Set the container's height to fit the grid
  elements.gridContainer.style.height = `${squareSize * rows}px`;

  // Set the grid template to create equal squares
  elements.gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${squareSize}px)`;
  elements.gridContainer.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

  // Clear existing squares
  elements.gridContainer.innerHTML = '';

  // Create and append squares
  const squareCount = gridSize * rows;
  for (let i = 0; i < squareCount; i++) {
    const squareDiv = document.createElement('div');
    squareDiv.classList.add('square');
    squareDiv.innerHTML = '';
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
