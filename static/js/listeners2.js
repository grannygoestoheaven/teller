import { elements, lastStoryData, getLastFilledSquares, setIsChatVisible, setSquareClickAuthorized } from '/static/js/config.js';
import { squareHasTitle } from '/static/js/subjectsService.js';
import { cycleToNextTopic, mapValuesToSquares } from '/static/js/uiInit.js';
import { TextInteractionSystem } from '/static/js/textInteractionSystem2.js';
import { toggleView, redSquare, transparentDashedSquare, defaultSquare, uiReadyButtons } from '/static/js/ui.js';
import { formatTitle } from '/static/js/utils.js';
import { getIsChatVisible } from '/static/js/config.js';
// import { uiClearInput } from 'static/js/ui.js';

// On page load, check if input has cached value
window.addEventListener('DOMContentLoaded', () => {
  if (elements.formInput.value.trim()) {
    // elements.formInput.dispatchEvent(new Event('input', { bubbles: true }));
    elements.formInput.focus(); // Optional: Auto-focus if needed
  }
});

export function stateMachineEvents(sm) {
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
      event.preventDefault();
      sm.dispatchEvent(AudioStateMachine.EventId.TOGGLE_PAUSE_RESUME); // leads to PAUSED state or PLAYING (resumed) state
    }
  });

  elements.formInput.addEventListener('focus', () => {
    sm.dispatchEvent(AudioStateMachine.EventId.INPUT_CHANGED); // leads to READY state if input is valid (guard is in statemachine), otherwise stays in IDLE
  })

  elements.formInput?.addEventListener('input', () => {
    console.log('Form input changed');
    sm.dispatchEvent(AudioStateMachine.EventId.INPUT_CHANGED); // leads to READY state if input is valid (guard is in statemachine), otherwise stays in IDLE
  });

  elements.formInput.addEventListener('blur', (e) => {
    console.log('Blur fired!'); // Will log on click outside
    if (e.relatedTarget === elements.playPauseButton || e.detail.view === 'text') return; // Skip if focus moved to the button
    sm.dispatchEvent(AudioStateMachine.EventId.INPUT_DEFOCUSED);
  }); 

  elements.playPauseButton?.addEventListener("click", () => {
    console.log('Play/Pause clicked');
    sm.dispatchEvent(AudioStateMachine.EventId.TOGGLE_PAUSE_RESUME); // leads to PLAYING state or PAUSED state
  });

  elements.stopButton?.addEventListener("click", () => {
    console.log("Stop clicked")
    sm.dispatchEvent(AudioStateMachine.EventId.CANCEL); // Leads to IDLE state
  })

  elements.form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = elements.formInput.value.trim();

    console.log('Form submitted');
    sm.dispatchEvent(AudioStateMachine.EventId.FORM_SUBMITTED) // leads to LOADING state
    elements.formInput.blur(); // Remove focus from input (hides cursor)
  });

  elements.speech?.addEventListener('canplaythrough', () => {
    console.log('Audio ready to play');
    sm.dispatchEvent(AudioStateMachine.EventId.SPEECH_READY); // leads to PLAYING state
  });

  elements.speech?.addEventListener('ended', () => {
    console.log('Audio ended');
    sm.dispatchEvent(AudioStateMachine.EventId.SPEECH_OVER);
  });

  elements.backgroundTrack?.addEventListener('ended', () => {
    console.log('Background track ended');
    sm.dispatchEvent(AudioStateMachine.EventId.MUSIC_OVER); // leads to MUSIC_ENDED state
  });

  elements.fromStartButton?.addEventListener("click", () => {
    console.log('Replay clicked');
    sm.dispatchEvent(AudioStateMachine.EventId.FROM_START_CLICKED); // leads to PLAYING state
  });

  elements.gridSquares.forEach(square => {
    square.addEventListener('mouseenter', () => {
      console.log('Hovered over square:', square.dataset.compactSubject);
      if (squareHasTitle(square)) {
        elements.formInput.value = square.dataset.compactSubject;
        // elements.formInput.focus();
        console.log("Hovered over square with compact subject:", square.dataset.compactSubject);
        elements.formInput.dispatchEvent(new Event('input'));
        // elements.formInput.focus(); // Optional: Focus input to show cursor
      }
    })
  });

  // elements.gridSquares.forEach(square => {
  //   square.addEventListener('mouseout', () => {
  //     defaultSquare(square); // Revert to default background on mouse out
  //   })
  // })

  elements.gridSquares.forEach(square => {
    square.addEventListener('click', () => { // we need to get sure the click happens only inside the grid - to prevent triggering reassigment of activeSquare when clicking outside, like when choosing a new topic.
      elements.activeSquare = square; // Store reference
      console.log('Square clicked:', elements.activeSquare.dataset.compactSubject);
      if (squareHasTitle(square)) {
        sm.dispatchEvent(AudioStateMachine.EventId.SQUARE_CLICKED);
      }
    });
  });
}

export function staticListeners() {

    document.addEventListener('viewChanged', (e) => {
        console.log('View changed to:', e.detail.view);
        if (e.detail.view === 'text' && lastStoryData?.storyTitle) {
        setIsChatVisible(true);
        elements.formInput.value = lastStoryData.storyTitle;
        console.log('Updated form input to story title:', lastStoryData);
        }
    });  

    elements.toggleButton?.addEventListener('click', () => {
        console.log('Toggling grid visibility');
        // sm.dispatchEvent(AudioStateMachine.EventId.VIEW_TOGGLED);
        toggleView();
    });

    // Handling mouse interactions with the story text for word highlighting and pasting
    elements.storyText?.addEventListener('mousemove', (e) => {
        TextInteractionSystem.handleMouseMove(e);
        // elements.formInput.dispatchEvent(new Event('input', { bubbles: true }));
        });
    
    elements.storyText?.addEventListener('mouseout', (e) => {
        TextInteractionSystem.handleMouseOut(e);
    });
    
    // Click: Paste highlighted words
    elements.storyText?.addEventListener('click', (e) => {
        if (e.target.classList.contains('highlight-word')) {
        // const allWords = currentlyHighlightedWords.map(span => span.textContent.trim());
        const cleanTitle = TextInteractionSystem.getCurrentlyHighlightedWords()
            .map(span => span.textContent.trim())
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).replace(/[.,]/g, ''))
            .join(' ');
        elements.formInput.value = cleanTitle;

        console.log("Pasted:", cleanTitle); // Debug
        elements.formInput.dispatchEvent(new Event('input'));
        elements.formInput.focus();
        // elements.formInput.blur(); // Remove focus (hides cursor)
        }
    });

    // Title click handler - now handles both topic cycling and state machine events
    elements.title?.addEventListener('click', (e) => {
        // Prevent text selection and default behavior
        e.preventDefault();
        e.stopPropagation();

        // Cycle to next topic
        cycleToNextTopic();
        mapValuesToSquares();
        // sm.dispatchEvent(AudioStateMachine.EventId.CANCEL); // leads to IDLE state
    });

    // Prevent double-click text selection on title
    elements.title?.addEventListener('mousedown', (e) => {
        if (e.detail > 1) {
        e.preventDefault();
        }
    });

    // Prevent text selection on subtitle (for future functionality)
    elements.subtitle?.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });

    // Subtitle click handler - currently a placeholder for future functionality
    elements.subtitle?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Subtitle clicked - ready for future functionality');
    });
    }
