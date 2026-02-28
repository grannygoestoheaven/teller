export const TextInteractionSystem = (function() {
    // All current variables move in here
    let lastProcessedText = null;
    let currentlyHighlightedWords = [];
    let lastZone = null;
    let lastSpan = null;
    let textContainer = null; // NEW: Store container reference
  
    // All functions will be moved inside here
    function init(container, options = {}) {
        // Store container reference
        // if (typeof container === 'string') {
        //   textContainer = document.querySelector(container);
        // } else {
        //   textContainer = container; // Assume it's already a DOM element
        // }
        textContainer = container; // Assume it's already a DOM element
      
        // Validate
        if (!textContainer) {
          console.error('TextInteractionSystem: Container not found');
          return false;
        }
      
        // Store any options (for future extensibility)
        // ...
      
        return true;
      }

    function wrapWordsInSpans() {
        clearHighlights(); // Clear highlights before updating text
        currentlyHighlightedWords = [];
        lastSpan = null;
        lastZone = 0;    

        if (!textContainer) {
            console.error('TextInteractionSystem: Container not initialized');
            return;
        }
        
        const text = textContainer.textContent.trim();
        // if (!text || text === lastProcessedText) return;
        textContainer.innerHTML = text
            .split(/\s+/) // Split on whitespace, returns a list
            .map(word => `<span class="word">${word}</span>`) // use the list to create a new list of spans
            .join(' '); // Join the list of spans back into a string and set as innerHTML
        
        lastProcessedText = text;  // Update cache
    }

    function handleMouseMove(event) {
        // Early exit if not initialized
        if (!textContainer) {
          console.warn('TextInteractionSystem: Not initialized');
          return;
        }
      
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
        const zone = 10 - Math.floor((mouseYRelativeToSpanTop / rect.height) * 10);
      
        // Only update if zone changed
        if (zone === lastZone) return;
        lastZone = zone;
      
        _highlightWords(target, zone);
      }

    function _highlightWords(startSpan, count) {
        if (!startSpan) {
          console.error("No valid span to highlight!");
          return;
        }
        clearHighlights();
        let currentSpan = startSpan;
        for (let i = 0; i < count && currentSpan; i++) {
            currentSpan.classList.add('highlight-word');
            currentlyHighlightedWords.push(currentSpan);
            currentSpan = _findNextWordSpan(currentSpan);
        }
    }

    // Helper: Find next word span
    function _findNextWordSpan(currentSpan) {
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
        });
        currentlyHighlightedWords = [];
    }

    function handleMouseOut(event) {
        if (!event.relatedTarget || !textContainer.contains(event.relatedTarget)) {
          clearHighlights();
        }
      }
  
    // Public API will be returned at the end
    return {
      init,
      wrapWordsInSpans,
      handleMouseMove,
      handleMouseOut,
      clearHighlights,
      getCurrentlyHighlightedWords: () => [...currentlyHighlightedWords]
    };
  })();

// For CommonJS (Node.js) compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextInteractionSystem;
  }
