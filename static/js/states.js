export function handleStateChange(sm, newState) {
    switch (newState) {
      case AudioSm.StateId.IDLE:
        sm.actions.stopAll?.();
        sm.actions.uiIdle?.();
        break;

      case AudioSm.StateId.READY:
        sm.actions.formNotEmpty?.();
  
      case AudioSm.StateId.LOADING:
        sm.actions.loadingSpeech?.();
        sm.actions.loadingUi?.();
        sm.actions.loadingDots?.();
        break;
  
      case AudioSm.StateId.PLAYING:
        sm.actions.startSpeech?.();
        sm.actions.startMusic?.();
        sm.actions.syncAll?.();
        sm.actions.playingDots?.();
        sm.actions.uiPlaying?.();
        break;
  
      case AudioSm.StateId.PAUSED:
        sm.actions.pauseAll?.();
        sm.actions.blurPlayingDots?.();
        sm.actions.uiPaused?.();
        break;
    }
  }
  