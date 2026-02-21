import { elements, lastTopicData, lastStoryData, getLastFilledSquares } from "/static/js/config.js";
import { mapValuesToSquares } from "/static/js/uiInit.js";
import { sanitizeSubject } from "/static/js/utils.js";

// send a topic to backend for it to returns a list of related subjects
export async function generateSubjectsListFromTopic() {

  let topic = elements.formInput.value.trim();
  console.log("Topic from form input:", topic);
  topic = sanitizeSubject(topic);
  console.log("Sanitized topic:", topic);

  // ==== API CALL 1: check if topic exists ====

  console.log(JSON.stringify({topic}));

  const response =  await fetch('/v1/topic/check_topic', {
    method: 'POST',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({topic})
  })

  console.log("Response from check_topic:", response);

  if (!response.ok) {
    const errorTopicData = await response.json();
    throw new Error(errorTopicData.error || `Error ${response.status}`);
  }

  const { exists, subjectsList } = await response.json();
  
  if (exists) {
    Object.assign(lastTopicData, subjectsList);
    mapValuesToSquares(lastTopicData.fullSubjects, lastTopicData.compactSubjects);
    
    return lastTopicData;

  } else {
    // ==== If subjects don't exist API CALL 2: generate new subjects list ====

    const response = await fetch('/v1/topic/generate_subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      const errorTopicData = await response.json();
      throw new Error(errorTopicData.error || `Error ${response.status}`);
    }

    const newTopicData = await response.json();
    console.log("Full data from backend:", newTopicData);
    Object.assign(lastTopicData, newTopicData);
    mapValuesToSquares(lastTopicData.fullSubjects, lastTopicData.compactSubjects);

    return lastTopicData;
  }
}

  export function addTitleToSquare() {
  'after storing the current story in /static/stories,'
  'we get the current story title from the form input '
  'and add it to a random square in the grid as a dataset attribute,'
  'so that when the user hovers over that square, the title of the story they just played'
  'will be displayed in the input field.'

  const availableSquares = Array.from(elements.gridSquares)
    .filter(square => !getLastFilledSquares().has(square));

  if (availableSquares.length === 0) {
    console.warn("All squares are filled!");
    return;
  }

  const square = availableSquares[Math.floor(Math.random() * availableSquares.length)];
  square.dataset.compactSubject = lastStoryData.storyTitle;
  getLastFilledSquares().add(square); // Track it
}

export function squareHasTitle(square) {
  return getLastFilledSquares().has(square);
}

export function pasteSquareTitleInInput(square) {
  if (squareHasTitle(square)) {
    elements.formInput.value = square.dataset.compactSubject;
  }
}