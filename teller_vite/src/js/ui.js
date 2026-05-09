import { setIsChatVisible, setIsGridVisible, setAreDotsVisible } from "./config.js";
import { getBluePinkColor, getRedGoldenrodColor, getGreenColor, makeFlashy } from "./colors.js";
import { elements, lastStoryData } from "./config.js";
import { playedSquares } from "./uiInit.js";

let currentView = 'grid' // Default view is grid, can be 'text' or 'dots'

export function clearStoryText() {
  elements.storyText.innerHTML = '';
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

export function inputIsValid() {
  return elements.formInput.value.trim().length > 0;
}

export function inputIsEmpty() {
  return elements.formInput.value.trim().length === 0;
}

export function blurInput() {
  elements.formInput.blur();
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

export function uiReadyButtons() {
  // Enable buttons when input is at least one character long
  // elements.fromStartButton.disabled = false;
  elements.playPauseButton.disabled = false;
  elements.playPauseButton.textContent = 'Start';
  // elements.chatHistoryContainer.disabled = !getIsChatVisible();
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

export function showText() {
  // Show text by setting opacity to 1
  elements.storyText.classList.remove('hidden'); // Removes display and pointer-events to none in CSS
  elements.storyText.classList.add('visible'); // Sets opacity to 1 in CSS
}

export function hideText() {
  elements.storyText.classList.add('hidden'); // Sets display and pointer-events to none in CSS
  elements.storyText.classList.remove('visible'); // Sets opacity to 1 and pointer-events to auto in CSS
}

export function showGrid() {
  elements.gridContainer.classList.remove('hidden');
  elements.gridContainer.classList.add('visible');
}

export function hideGrid() {
  elements.gridContainer.classList.add('hidden');
  elements.gridContainer.classList.remove('visible');
}

export function showDots() {
  elements.dotsContainer.classList.remove('hidden');
  elements.dotsContainer.classList.add('visible');
}

export function hideDots() {
  elements.dotsContainer.classList.add('hidden');
  elements.dotsContainer.classList.remove('visible');
}

export function toggleTextVisibility() {
  const isTextVisible = elements.storyText.classList.contains('visible');
  if (isTextVisible) hideStoryText();
  else showStoryText();
}

export function updateStoryText() {
  elements.storyText.innerHTML = lastStoryData.story;
  console.log(elements.storyText.innerHTML);
}

export function toggleView() {
  switch (currentView) {
    case 'grid': dotsView(); break;
    case 'dots': textView(); break;
    case 'text': gridView(); break;
  }
  document.dispatchEvent(new CustomEvent('viewChanged', { detail: { view: currentView } })); // Dispatch custom event with the new view for later side effects.
}

export function gridView() {
  hideText(), hideDots(); showGrid();
  currentView = 'grid';
  setIsGridVisible(true);
  setIsChatVisible(false);
  setAreDotsVisible(false);
}
export function dotsView() {
  hideGrid(); hideText(); showDots();
  currentView = 'dots';
  setAreDotsVisible(true);
  setIsChatVisible(false);
  setIsGridVisible(false);
}
export function textView() {
  hideDots(); hideGrid(); showText();
  currentView = 'text';
  setIsChatVisible(true);
  setIsGridVisible(false);
  setAreDotsVisible(false);
}

export function lockGrid() {
  elements.gridSquares.forEach(square => {
    square.style.pointerEvents = 'none';
  });
}

export function unlockGrid() {
  elements.gridSquares.forEach(square => {
    square.style.pointerEvents = 'auto';
  });
}

export function redSquare(square) {
  const color = getBluePinkColor();
  const borderColor = makeFlashy(color);
  // square.style.setProperty('background-color', '#cc0606');
  square.style.setProperty('background-color', color);
  square.style.setProperty('border', borderColor);
}

export function greenSquare(square) {
  const color = getGreenColor();
  // const borderColor = makeFlashy(color);
  // square.style.setProperty('background-color', '#6d9778');
  square.style.setProperty('background-color', color);
  // square.style.setProperty('border', borderColor);
}

export function goldenSquares(square) {
  const color = getRedGoldenrodColor();
  const borderColor = makeFlashy(color);
  // square.style.setProperty('background-color', color);
  // square.style.setProperty('border', `1px dashed ${borderColor}`);
  square.style.setProperty('border', '2px dashed black');
}

export function transparentDashedSquare(square) {
  square.style.setProperty('border', '2px dashed black');
  // square.style.setProperty('border', '1px dashed rgb(254, 245, 222)');
}

export function defaultSquare(square) {
  square.style.setProperty('background-color', 'transparent');
}

export function applyGridViewStyle() {
  elements.formInput.style.opacity = 0.5;
}

export function applyDotsViewStyle() {
  elements.formInput.style.opacity = 1;
}

export function dotsViewTitle() {
  if (elements.activeSquare) {
    elements.formInput.value = elements.activeSquare.dataset.compactSubject;
    console.log(elements.activeSquare.dataset.compactSubject);
    console.log('elements.formInput.value set to:', elements.formInput.value);
  } else {
    elements.formInput.value = lastStoryData.storyTitle;
  }
}

export function removeSquareFromPlayed() {
  let square = elements.activeSquare;
  playedSquares.delete(square);
  // elements.activeSquare.style.backgroundColor = 'transparent';
}

export function fixSquareColor() {
  // Set the background color to a fixed color
  let square = elements.activeSquare;
  if (playedSquares.has(square)) {
    square.style.setProperty('--square-border', '1px dashed white')
    // square.style.backgroundColor = 'rgba(204, 6, 6, 0.2)';
    // square.style.borderColor = 'rgba(204, 6, 6)';
  }
}

export function removeFixedColorFromSquare() {
  elements.activSquare.style.backgroundColor = 'transparent';
}
