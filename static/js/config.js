export const elements = {}; // the elements object is defined in main.js
export let lastStoryData = {}; // the lastStoryData object is assigned in storyService.js
export let lastTopicData = {}; // the lastTopicData object is assigned in storyService.js

// export let fullSubjects = []; // for later use, will be populated from subjects files in relation to the field the user would have clicked onto.
// export let compactSubjects = []; // for later use, will be populated from subjects files - in a compacted version - in relation to the field the user would have clicked onto.

// Global variables
let squaresPerWidth = 7; // Default squares per width
let gridValues = new Map(); // { id: { value: string, size: string } }
let isGridVisible = true; // Default visibility
let isChatVisible = false; // Default chat visibility
let squareValues = []; // Array to hold values for each square

// Getters
export function getGridSize() { return gridSize; }
export function getSquaresPerWidth() { return squaresPerWidth; }
export function getGridValues() { return gridValues; }
export function getIsGridVisible() { return isGridVisible; }
export function getIsChatVisible() { return isChatVisible; }
export function getSquaresValuesList() { return squareValues; }

// Setters
export function setGridSize(value) { gridSize = value; }
export function setGridValues(value) { gridValues = value; }
export function setIsGridVisible(value) { isGridVisible = value; }

// export function mapValuesToSquares(squares, fullSubjects, compactSubjects) {
//   squares.forEach((square, index) => {
//     if (index <= fullSubjects.length) { // ??? <= or < ?
//       square.dataset.fullSubject = fullSubjects[index]; // Backend version
//       square.dataset.compactSubject = compactSubjects[index]; // Hover version
//     }
//   });
//   }

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
