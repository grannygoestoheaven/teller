export function handleStateChange(sm, newStateId) {
    switch (newStateId) {
      case AudioSm.StateId.IDLE:
        console.log('State changed to IDLE');
        sm.actions.stopAll?.();
        sm.actions.uiIdle?.();
        break;

      case AudioSm.StateId.READY:
        sm.actions.inputNotEmpty?.(); // buttons turn to enabled and their text changes
        break;
  
      case AudioSm.StateId.LOADING:
        sm.actions.showLoadingAnimation?.();
        sm.actions.uiLoadingButtons?.();

        // sm.actions.AudioReadinessListener?.(sm);
        // console.log('still here')
        // const formObject = elements.form;
        // if (!formObject) return; // stop if empty

        sm.actions.startNewStoryProcess?.().then((data) => {
          console.log("DIAGNOSTIC: Network fetch succeeded. Data received:", data);
          sm.actions.loadPlayer?.(data);
        });
        break;

      case AudioSm.StateId.PLAYING:
        if (sm.StateId === AudioSm.StateId.PAUSED) {
            sm.actions.resumeAllAudio?.();
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
        sm.actions.startSpeech?.();
        sm.actions.startMusic?.();
  
      case AudioSm.StateId.PAUSED:
        sm.actions.pauseAllAudio?.();
        sm.actions.addBlurr?.();
        break;

      case AudioSm.StateId.TEXT_DISPLAYED:
        sm.actions.hideLoadingAnimation?.();
        sm.actions.streamText?.();
        sm.actions.handleWordClick?.();
        sm.actions.handleMouseMove?.();
        sm.actions.handleMouseOut?.();
        sm.actions.findNextWordSpan?.();
        sm.actions.clearHighlights?.();
    }
  }
  