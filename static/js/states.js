export function handleStateChange(sm, newStateId) {
    switch (newStateId) {
      case AudioSm.StateId.IDLE:
        console.log('State changed to IDLE');
        sm.actions.stopAll?.();
        sm.actions.uiIdle?.();
        break;

      case AudioSm.StateId.READY:
        console.log('State changed to READY');
        sm.actions.inputNotEmpty?.(); // buttons turn to enabled and their text changes
        break;
  
      case AudioSm.StateId.LOADING:
        console.log('State changed to LOADING');
        sm.actions.showLoadingAnimation?.();
        sm.actions.uiLoadingButtons?.();

        // sm.actions.AudioReadinessListener?.(sm);
        // console.log('still here')
        // const formObject = elements.form;
        // if (!formObject) return; // stop if empty

        sm.actions.startNewStoryProcess?.().then((data) => {
          console.log("DIAGNOSTIC: Network fetch succeeded. Data received:", data);
          sm.actions.uiClearInput?.();
          sm.actions.loadPlayer?.(data);
        });
        break;

      case AudioSm.StateId.PLAYING:
        console.log('State changed to PLAYING');
        console.log('Previous State ID:', sm.prevStateId);
        if (sm.prevStateId === AudioSm.StateId.PAUSED) {
            sm.actions.resumeAllAudio?.();
            sm.actions.removeBlur?.();
          } else {
            sm.actions.startMusic?.();
            sm.actions.startSpeech?.();
          }
          sm.actions.syncAll?.();
          sm.actions.removeBlur?.();
          sm.actions.uiPlayingButtons?.();
          sm.actions.redDots?.();
          break;
          
      case AudioSm.StateId.REPLAYING:
        console.log('State changed to REPLAYING');
        sm.actions.startSpeech?.();
        sm.actions.startMusic?.();
        break;
  
      case AudioSm.StateId.PAUSED:
        console.log('State changed to PAUSED');
        sm.actions.pauseAllAudio?.();
        sm.actions.addBlurr?.();
        break;

      case AudioSm.StateId.TEXT_DISPLAYED:
        console.log('State changed to TEXT_DISPLAYED');
        sm.actions.hideLoadingAnimation?.();
        sm.actions.streamText?.();
        sm.actions.handleWordClick?.();
        sm.actions.handleMouseMove?.();
        sm.actions.handleMouseOut?.();
        sm.actions.findNextWordSpan?.();
        sm.actions.clearHighlights?.();
    }
  }
  