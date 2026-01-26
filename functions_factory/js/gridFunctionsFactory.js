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

  // the following function could be used later if we want to map main topic to squares instead of the teller subtitle.
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