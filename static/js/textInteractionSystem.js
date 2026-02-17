import { elements } from './config.js';

// Cache the last processed text to avoid redundant work
let lastProcessedText = null;
export let currentlyHighlightedWords = [];

// Main setup function
// function setupZoneSelection(container, inputElement) {
//     container.addEventListener('mousemove', (e) => handleMouseMove(e, container, inputElement));
//     container.addEventListener('mouseout', handleMouseOut);
// }

// Core logic: Vertical zone-based highlighting
let lastZone = null; // Track the last zone
let lastSpan = null;  // Track the last span

export function handleMouseMove(event, inputElement) {
    const target = event.target;
    if (!target.classList.contains('word')) {
        clearHighlights();
        lastSpan = null;
        lastZone = 0;
        return;
    }

    // Reset if the span changed
    if (target !== lastSpan) {
        clearHighlights();
        lastSpan = target;
        lastZone = 0;
    }

    const rect = target.getBoundingClientRect();
    const mouseYRelativeToSpanTop = event.clientY - rect.top;
    const zone = 7 - Math.floor((mouseYRelativeToSpanTop / rect.height) * 7); // Zone 1 (bottom) to 7 (top)

    // Only update if zone changed
    if (zone === lastZone) return;
    lastZone = zone;

    // Highlight 'zone' words (zone 1 = 1 word, zone 7 = 7 words)
    highlightWords(target, zone, inputElement);
}


// export function handleMouseMove(event, inputElement) {
//     const target = event.target;
//     if (!target.classList?.contains('word')) {
//         clearHighlights();
//         lastZone = null; // Reset on new target
//         return;
//     }

//     const rect = target.getBoundingClientRect();
//     const mouseYRelativeToSpanTop = event.clientY - rect.top;
//     const zone = 7 - Math.floor((mouseYRelativeToSpanTop / rect.height) * 10);

//     // Only update if zone changed
//     if (zone === lastZone) return;
//     lastZone = zone;

//     clearHighlights();
//     const wordsToHighlight = Math.max(1, Math.min(zone, 10));
//     highlightWords(target, wordsToHighlight, inputElement);
// }


// export function handleMouseMove(event, inputElement) {
//     const target = event.target;
//     if (!target.classList?.contains('word')) {
//         clearHighlights();
//         return;
//     }

//     clearHighlights();
//     const rect = target.getBoundingClientRect();
//     const mouseYRelativeToSpanTop = event.clientY - rect.top;
//     const zone = 7 - Math.floor((mouseYRelativeToSpanTop / rect.height) * 10);
//     const wordsToHighlight = Math.max(1, Math.min(zone, 10));

//     highlightWords(target, wordsToHighlight, inputElement);
// }

// Highlight adjacent words

function highlightWords(startSpan, count, inputElement) {
    clearHighlights(); // Clear previous highlights
    let currentSpan = startSpan;
    for (let i = 0; i < count && currentSpan; i++) {
        currentSpan.classList.add('highlight-word');
        currentlyHighlightedWords.push(currentSpan);
        currentSpan = findNextWordSpan(currentSpan);
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
function clearHighlights() {
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
