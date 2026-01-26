// ===== This module is about squares grids initializations and mappings =====
import { elements } from '/static/js/config.js';
import { defaultFields } from "/static/fields/defaultFieldsSmall.js";

const topics = Object.keys(defaultFields); // gets the list of topics from the defaultFields object

// Topic cycling variables
let currentTopicData = defaultFields[topics[0]];
let currentTopicIndex = 0;

const fragment = document.createDocumentFragment(); // Create a document fragment to optimize DOM updates

const compactSubjects = getCurrentTopicSubjects('compact'); // the list of compact subjects (for display)
const fullSubjects = getCurrentTopicSubjects('full'); // the list of full subjects (for backend)

// Get the current main topic's (teller-subtitle) subjects, e.g 'Architecture' or 'Science'
export function getCurrentTopicSubjects(type = 'compact') {
  return currentTopicData[type] || [];
}

export function getCurrentTopic() {
  return topics[currentTopicIndex];
}

export function initTopicCycling() {
  // Set initial topic
  if (elements.subtitle) {
    elements.subtitle.textContent = topics[currentTopicIndex];
  }
}

export function cycleToNextTopic() {
  currentTopicIndex = (currentTopicIndex + 1) % topics.length;
  console.log(`Current topic index: ${currentTopicIndex}`);
  currentTopicData = defaultFields[topics[currentTopicIndex]];
  console.log(`Cycled to topic: ${topics[currentTopicIndex]}`);
  
  if (elements.subtitle) {
    elements.subtitle.textContent = topics[currentTopicIndex];
  }
  
  return topics[currentTopicIndex];
}

export function setTopicByIndex(index) {
  if (index >= 0 && index < topics.length) {
    currentTopicIndex = index;
    if (elements.subtitle) {
      elements.subtitle.textContent = topics[currentTopicIndex];
    }
  }
}

export function getAllTopics() {
  return [...topics];
}

// the following function will be called each time the main topic changes
export function initializeGrid(squares) {
  // populate the grid with the subjects related to the new topic.
  // each time the 'teller' title is clicked, the topic (teller-subtitle) changes and so does the subjects list
  mapValuesToSquares(squares, fullSubjects, compactSubjects);
  console.log(`Grid initialized with ${compactSubjects.length} subjects from topic: ${getCurrentTopic()}`);
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

export function mapValuesToSquares() {
    // ✅ Fetch latest subjects every time - it's ok for now
    const compactSubjects = getCurrentTopicSubjects('compact');
    const fullSubjects = getCurrentTopicSubjects('full');

  elements.gridSquares.forEach((square, index) => {
    if (index < fullSubjects.length) { // Use < to avoid undefined errors
      square.dataset.fullSubject = fullSubjects[index];
      square.dataset.compactSubject = compactSubjects[index];
      square.textContent = compactSubjects[index];
      console.log(`compactSubject='${compactSubjects[index]}'`);

      // elements.formInput.dispatchEvent(new Event('input', { bubbles: true }));

      // Attach click listener
      // square.addEventListener('click', () => {
      //   console.log("Square clicked! Current state:", sm.currentState);
      //   sm.dispatchEvent(AudioStateMachine.EventId.FORM_SUBMITTED);
      // });
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
      fragment.appendChild(squareDiv);
      squareDiv.classList.add('square');
      squareDiv.textContent = '';
      elements.gridContainer.append(squareDiv);
  }
  elements.gridContainer.appendChild(fragment)
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

export function lockTitleSend() {
    elements.formInput.dataset.locked = 'true';  // Set when a square is playing
  }
  
  export function unlockTitleSend() {
  elements.formInput.dataset.locked = 'false'; // Clear when playback ends
}

// export function lockTitleSend() {
//   elements.gridSquares.forEach(square => {
//     square.style.pointerEvents = 'none'; // Or toggle a class
//   });
// }

// export function unlockTitleSend() {
//   elements.gridSquares.forEach(square => {
//     square.style.pointerEvents = 'auto';
//   });
// }

export function showSquareTitle() {
  elements.square.classList.add('visible');
}