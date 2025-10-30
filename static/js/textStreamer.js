import { elements } from "./config.js";

let currentlyHighlightedWords = [];

// Function to stream text with typing effect and add interactivity
export async function streamText() {
    const story = elements.storyText;
    storyTxt.innerHTML = ''; // Clear container before streaming

    const delay = 5; // Base delay in milliseconds
    const parts = text.match(/(\w+|[^\w\s]|\s+)/g);

    if (!parts) {
         const cursor = document.createElement('span');
         cursor.className = 'cursor-standby';
         chatHistoryElement.appendChild(cursor);
        return;
    }

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        let node;

        if (/\w+/.test(part)) { // If it's a word
            node = document.createElement('span');
            node.textContent = part;
            node.classList.add('word'); // Add a class to identify word spans
            node.addEventListener('click', handleWordClick); // Click listener
        } else { // If it's spaces or punctuation
             node = document.createTextNode(part);
        }

        chatHistoryElement.appendChild(node);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

     const existingCursor = chatHistoryElement.querySelector('.cursor-standby');
     if (existingCursor) {
         existingCursor.remove();
     }

     const finalCursor = document.createElement('span');
     finalCursor.className = 'cursor-standby';
     chatHistoryElement.appendChild(finalCursor);

    chatHistoryElement.addEventListener('mousemove', handleMouseMove);
    chatHistoryElement.addEventListener('mouseout', handleMouseOut);
}

 // Helper function to find the next word span in the history
export function findNextWordSpan(currentSpan) {
    let nextNode = currentSpan.nextSibling;
    while (nextNode) {
        if (nextNode.nodeType === Node.ELEMENT_NODE && nextNode.classList.contains('word') && nextNode.parentElement === chatHistoryElement) {
            return nextNode;
        }
        nextNode = nextNode.nextSibling;
    }
    return null;
}

// Handles clicking on a word span in the chat history
export function handleWordClick() {
    if (currentlyHighlightedWords.length === 0) {
        return;
    }

    const wordsToToggleSet = new Set(currentlyHighlightedWords.map(span => span.textContent.trim()));
    let subjectWordsSet = new Set(subjectInputElement.value.trim().split(/\s+/).filter(word => word.length > 0));

    wordsToToggleSet.forEach(word => {
        if (subjectWordsSet.has(word)) {
            subjectWordsSet.delete(word);
        } else {
            subjectWordsSet.add(word);
        }
    });
    subjectInputElement.value = Array.from(subjectWordsSet).join(' ');
}

// Handles mouse movement for highlighting
export function handleMouseMove(event) {
    const target = event.target;
    const parent = target.parentElement;

    if (parent === chatHistoryElement) {
        clearHighlights();

        if (target.classList && target.classList.contains('word')) {
            const rect = target.getBoundingClientRect();
            const mouseYRelativeToSpanTop = event.clientY - rect.top;
            const spanHeight = rect.height;

            target.classList.add('highlight-word');
            currentlyHighlightedWords.push(target);

            let zone = 10 - Math.floor((mouseYRelativeToSpanTop / spanHeight) * 10);
            zone = Math.max(1, Math.min(zone, 10));
            let wordsToHighlight = zone;

            let currentSpan = target;
            for (let i = 0; i < wordsToHighlight - 1; i++) {
                const nextWord = findNextWordSpan(currentSpan);
                if (nextWord) {
                    nextWord.classList.add('highlight-word');
                    currentlyHighlightedWords.push(nextWord);
                    currentSpan = nextWord;
                } else {
                    break;
                }
            }
        } else if (target.nodeType === Node.TEXT_NODE) {
             let prevElement = target.previousElementSibling;
             let nextElement = target.nextElementSibling;

             if (prevElement && prevElement.classList.contains('word')) {
                 prevElement.classList.add('highlight-word');
                 currentlyHighlightedWords.push(prevElement);
             }
             if (nextElement && nextElement.classList.contains('word')) {
                 nextElement.classList.add('highlight-word');
                 currentlyHighlightedWords.push(nextElement);
             }
        }
    } else {
         clearHighlights();
    }
}

// Handles mouse leaving the chat history area
export function handleMouseOut(event) {
    if (!event.relatedTarget || !chatHistoryElement.contains(event.relatedTarget)) {
         clearHighlights();
    }
}

// Clears all currently highlighted word spans
export function clearHighlights() {
    currentlyHighlightedWords.forEach(span => {
        span.classList.remove('highlight-word');
    });
    currentlyHighlightedWords = [];
}