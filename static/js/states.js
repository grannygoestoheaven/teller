export function handleStateChange(sm, newState) {
    switch (newState) {
      case AudioSm.StateId.IDLE:
        sm.actions.stopAll?.();
        sm.actions.uiIdle?.();
        break;

      case AudioSm.StateId.READY:
        sm.actions.formNotEmpty?.();
  
      case AudioSm.StateId.LOADING:
        sm.actions.startNewStoryProcess?.();
        sm.actions.showLoadingAnimation?.();
        break;
  
      // case AudioSm.StateId.PLAYING:
      //   sm.actions.startSpeech?.();
      //   sm.actions.startMusic?.();
      //   sm.actions.syncAll?.();
      //   sm.actions.removeBlur?.()
      //   sm.actions.redDots?.();
      //   break;

      case AudioSm.StateId.PLAYING:
        if (sm.previousState === AudioSm.StateId.PAUSED) {
            sm.actions.resumeAllAudio?.();
        } else {
            sm.actions.startSpeech?.();
            sm.actions.startMusic?.();
        }
        sm.actions.syncAll?.();
        sm.actions.removeBlur?.();
        sm.actions.redDots?.();
        break;
  
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
  