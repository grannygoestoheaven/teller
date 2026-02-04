import { elements, lastTopicData } from "./config.js";
import { mapValuesToSquares } from "./uiInit.js";
import { sanitizeSubject } from "./utils.js";

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
