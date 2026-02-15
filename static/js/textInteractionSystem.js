import { elements } from './config.js';

const container = elements.storyText;
const input = document.getElementById('selected-words');

// Cache the last processed text to avoid redundant work
let lastProcessedText = null;
let currentlyHighlightedWords = [];

// Main setup function
function setupZoneSelection(container, inputElement) {
    container.addEventListener('mousemove', (e) => handleMouseMove(e, container, inputElement));
    container.addEventListener('mouseout', handleMouseOut);
}

// Core logic: Vertical zone-based highlighting
export function handleMouseMove(event, container, inputElement) {
    const target = event.target;
    if (!target.classList?.contains('word')) {
        clearHighlights();
        return;
    }

    clearHighlights();
    const rect = target.getBoundingClientRect();
    const mouseYRelativeToSpanTop = event.clientY - rect.top;
    const zone = 7 - Math.floor((mouseYRelativeToSpanTop / rect.height) * 10);
    const wordsToHighlight = Math.max(1, Math.min(zone, 10));

    highlightWords(target, wordsToHighlight, inputElement);
}

// Highlight adjacent words
export function highlightWords(startSpan, count, inputElement) {
    let currentSpan = startSpan;
    for (let i = 0; i < count; i++) {
        if (currentSpan) {
            currentSpan.classList.add('highlight-word');
            currentlyHighlightedWords.push(currentSpan);

            // Paste all highlighted words on click
            currentSpan.onclick = () => {
                const allWords = currentlyHighlightedWords.map(span => span.textContent.trim());
                inputElement.value = allWords.join(' ');
            };

            currentSpan = findNextWordSpan(currentSpan);
        }
    }
}

// Helper: Find next word span
export function findNextWordSpan(currentSpan) {
    let nextNode = currentSpan.nextSibling;
    while (nextNode) {
        if (nextNode.nodeType === Node.ELEMENT_NODE && nextNode.classList.contains('word')) {
            return nextNode;
        }
        nextNode = nextNode.nextSibling;
    }
    return null;
}

// Helper: Clear all highlights
export function clearHighlights() {
    currentlyHighlightedWords.forEach(span => {
        span.classList.remove('highlight-word');
        span.onclick = null;
    });
    currentlyHighlightedWords = [];
}

// Mouse-out handler
export function handleMouseOut(event) {
    if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
        clearHighlights();
    }
}

// export function wrapWordsInSpans() {
//     const text = elements.storyText.textContent;
//     elements.storyText.innerHTML = text.split(/\s+/).map(word =>
//         `<span class="word">${word}</span>`
//     ).join(' ');
// }

export function wrapWordsInSpans() {
    if (!elements.storyText) return;

    const text = elements.storyText.textContent.trim();
    if (!text || text === lastProcessedText) return;  // Skip if unchanged

    elements.storyText.innerHTML = text
        .split(/\s+/)
        .map(word => `<span class="word">${word}</span>`)
        .join(' ');

    lastProcessedText = text;  // Update cache
}


// // Demo function -> Initialize after DOM loads
// document.addEventListener('DOMContentLoaded', () => {
//     const container = document.getElementById('text-container');
//     const input = document.getElementById('selected-words');

//     // Wrap words in spans
//     const text = container.textContent;
//     container.innerHTML = text.split(/\s+/).map(word =>
//         `<span class="word">${word}</span>`
//     ).join(' ');

//     // Start the feature
//     setupZoneSelection(container, input);
// });
