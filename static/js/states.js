export function handleStateChange(sm, newState, actions) {
    actions = actions || sm.actions; // in case actions are passed directly
    switch (newState) {
      case AudioSm.StateId.IDLE:
        sm.actions.stopAll?.();
        sm.actions.uiIdle?.();
        break;

      case AudioSm.StateId.READY:
        sm.actions.inputNotEmpty?.();
        break;
  
      case AudioSm.StateId.LOADING:
        sm.actions.showLoadingAnimation?.();
        sm.actions.startNewStoryProcess?.().then((data) => {
            // This is where you get the audio data
            // We pass it to loadPlayer to set the audio sources
            sm.actions.loadPlayer?.({
                speech: sm.actions.speechAudio,
                background: sm.actions.backgroundAudio,
                dt: data
            });
        });
        break;

      case AudioSm.StateId.PLAYING:
          sm.actions.loadPlayer?.();
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
  