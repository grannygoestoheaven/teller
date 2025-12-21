import { fullSubjects, compactSubjects } from '../subjects/fields/philosophy/philosophyBasics.js';

export const elements = {}; // the elements object is defined in main.js
export let lastStoryData = {}; // the lastStoryData object is defined in storyService.js

// export let fullSubjects = []; // for later use, will be populated from subjects files in relation to the field the user would have clicked onto.
// export let compactSubjects = []; // for later use, will be populated from subjects files - in a compacted version - in relation to the field the user would have clicked onto.

// Global variables
let gridSize = 6; // Default size
let squaresPerWidth = 7; // Default squares per width
let gridValues = new Map(); // { id: { value: string, size: string } }
let isGridVisible = true; // Default visibility
let squareValues = []; // Array to hold values for each square

// Getters
export function getGridSize() { return gridSize; }
export function getSquaresPerWidth() { return squaresPerWidth; }
export function getGridValues() { return gridValues; }
export function getIsGridVisible() { return isGridVisible; }
export function getSquaresValuesList() { return squareValues; }

// Setters
export function setGridSize(value) { gridSize = value; }
export function setGridValues(value) { gridValues = value; }
export function setIsGridVisible(value) { isGridVisible = value; }

export function mapValuesToSquares(squares, fullSubjects, compactSubjects) {
    squares.forEach((square, index) => {
      if (index <= fullSubjects.length) {
        square.dataset.fullSubject = fullSubjects[index]; // Backend version
        square.dataset.compactSubject = compactSubjects[index]; // Hover version
      }
    });
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
    // Map values to squares
    elements.gridSquares = getSquareElements() // Store squares in elements for later access

    console.log(mapValuesToSquares(elements.gridSquares, fullSubjects, compactSubjects)); // placed here for now, later in storyService.js as the result of the API call
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
  