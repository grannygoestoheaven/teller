import { elements } from './config.js';
import { defaultFields } from "../fields/defaultFieldsSmall.js";

export function initializeGrid(squares, sm) {
  // Get the current topic's subjects
  const compactSubjects = getCurrentTopicSubjects('compact');
  const fullSubjects = getCurrentTopicSubjects('full');

  // Populate the grid
  mapValuesToSquares(squares, fullSubjects, compactSubjects, sm);

  console.log(`Grid initialized with ${compactSubjects.length} subjects from topic: ${getCurrentTopic()}`);
}

// Topic cycling utility
const topics = Object.keys(defaultFields);
let currentTopicData = defaultFields[topics[0]];
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

export function getCurrentTopicSubjects(type = 'compact') {
  return currentTopicData[type] || [];
}

/**
 * Cycle to the next topic
 * @returns {string} The new current topic
 */
export function cycleToNextTopic() {
  currentTopicIndex = (currentTopicIndex + 1) % topics.length;
  currentTopicData = defaultFields[topics[currentTopicIndex]];
  
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

// When a user clicks a subject (e.g., in your grid click handler):
const handleSubjectClick = (clickedSubject) => {
  // Get the full list of subjects for the current field (e.g., Science)
  const allSubjects = [...fullSubjects]; // Replace with your actual list

  // Filter out the clicked subject
  remainingSubjects = allSubjects.filter(subject => subject !== clickedSubject);

  console.log("Remaining subjects:", remainingSubjects);
  // Now `remainingSubjects` contains all subjects except the clicked one.
};

// export function mapValuesToSquares(squares, fullSubjects, compactSubjects) {
//   squares.forEach((square, index) => {
//     if (index <= fullSubjects.length) { // ??? <= or < ?
//       square.dataset.fullSubject = fullSubjects[index]; // Backend version
//       square.dataset.compactSubject = compactSubjects[index]; // Hover version
//     }
//   });
//   }

export function mapMainFieldsToSquares(squares, mainFields) {
  squares.forEach((square, index) => {
    if (index < mainFields.length) { // Use < to avoid undefined errors
      square.dataset.mainField = mainFields[index];

      // Attach click listener
      square.addEventListener('click', () => {
        console.log("Square clicked! Current state:", sm.currentState);
        sm.dispatchEvent(AudioStateMachine.EventId.FORM_SUBMITTED);
      });
    }
  });
}

export function mapValuesToSquares(squares, fullSubjects, compactSubjects, sm) {
  squares.forEach((square, index) => {
    if (index < fullSubjects.length) { // Use < to avoid undefined errors
      square.dataset.fullSubject = fullSubjects[index];
      square.dataset.compactSubject = compactSubjects[index];

      // elements.formInput.dispatchEvent(new Event('input', { bubbles: true }));

      // Attach click listener
      square.addEventListener('click', () => {
        console.log("Square clicked! Current state:", sm.currentState);
        sm.dispatchEvent(AudioStateMachine.EventId.FORM_SUBMITTED);
      });
    }
  });
}

export function mapColorsToSquares(squares, colorArray) {
  squares.forEach((square, index) => {
    if (index < colorArray.length) {
      square.style.backgroundColor = colorArray[index];
    }
  });
}

export function createColorArray(squaresPerWidth) {
  const currentGridSize = squaresPerWidth * squaresPerWidth;
  const colors = [];
  for (let i = 0; i < currentGridSize; i++) {
    const hue = Math.floor(((i / 2 ) / currentGridSize)* 100); // Spread hues around the color wheel
    colors.push(`hsl(${hue}, 45%, 24%)`);
  }
  return colors;
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
  
export function getSquareElements() {
    return elements.gridContainer.querySelectorAll('.square');
}

function assignInfoDictsToSquares(squares, subjectArray) {
  squares.forEach(square => {
    square.dataset.squareInfo = subjectArray[square]
    if (square) {
      square.style.setProperty(
        '--hover-color',
        `var(--topic-${subject.topic}-sub${subject.subcolor})`
      );
    } else {
      console.warn(`Square with ID ${subject.id} not found.`);
    }
  });
}

export function createGridOfSquares(squaresPerWidth) {
  let squareCount = (squaresPerWidth * squaresPerWidth);
  // let colorArray = createColorArray(squaresPerWidth);
  console.log(squareCount);
  
  elements.gridContainer.style.display = 'grid';
  elements.gridContainer.style.gridTemplateColumns = `repeat(${squaresPerWidth}, 1fr)`;
  elements.gridContainer.style.gridTemplateRows = `repeat(${squaresPerWidth}, 1fr)`;

  // let's fill the grid
  for(let i = 0; i < squareCount; i++)
  {
      const squareDiv = document.createElement('div');
      squareDiv.classList.add('square');
      squareDiv.textContent = '';
      elements.gridContainer.append(squareDiv);
  }
  // Map values to squares
  elements.gridSquares = getSquareElements() // Store squares in elements for later access
  // mapValuesToSquares(elements.gridSquares, fullSubjects, compactSubjects); // placed here for now, later in storyService.js as the result of the API call
  // mapColorsToSquares(elements.gridSquares, colorArray);
  // let subjectsArray = createSubjectsInfoDicts(squareCount, fullSubjects, compactSubjects);
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

// export function lockTitleSend() {
//   elements.gridSquares.forEach(square => {
//     square.style.pointerEvents = 'none'; // Or toggle a class
//   });
// }

export function lockTitleSend() {
  elements.formInput.dataset.locked = 'true';  // Set when a square is playing
}

export function unlockTitleSend() {
  elements.formInput.dataset.locked = 'false'; // Clear when playback ends
}

// export function unlockTitleSend() {
//   elements.gridSquares.forEach(square => {
//     square.style.pointerEvents = 'auto';
//   });
// }
