import { sm } from "./config.js";

export function handleStateChange() {
    switch (newStateId) {
      case AudioSm.StateId.IDLE:
        sm.actions.stopAll?.();
        sm.actions.uiIdle?.();
        break;

      case AudioSm.StateId.READY:
        sm.actions.inputNotEmpty?.(); // buttons turn to enabled and their text changes
        break;
  
      case AudioSm.StateId.LOADING:
        sm.actions.showLoadingAnimation?.();
        sm.actions.uiLoadingButtons?.();
        
        const formObject = sm.actions.form;
        if (!formObject) return; // stop if empty

        sm.actions.startNewStoryProcess?.()
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
  
// export function handleStateChange(sm, newState, actions) {
//   actions = actions || sm.actions; // in case actions are passed directly
//   console.log("=== handleStateChange ===", AudioSm.stateIdToString(newState));
//   console.log("sm.actions at handleStateChange:", sm.actions);

//   switch (newState) {
//       case AudioSm.StateId.IDLE:
//           console.log("Calling stopAll and uiIdle");
//           sm.actions.stopAll?.();
//           sm.actions.uiIdle?.();
//           break;

//       case AudioSm.StateId.READY:
//           console.log("LOADING case, sm.actions.form:", sm.actions.form);
//           console.log("Calling inputNotEmpty");
//           sm.actions.inputNotEmpty?.();
//           break;

//       case AudioSm.StateId.LOADING:
//           console.log("LOADING case, sm.actions.form:", sm.actions.form);
//           console.log("Calling showLoadingAnimation");
//           sm.actions.showLoadingAnimation?.();
          
//           const formObject = sm.actions.form;
//           if (!formObject) {
//               console.log("No formObject, returning");
//               return;
//           }

//           console.log("Calling startNewStoryProcess with formObject:", formObject);
//           sm.actions.startNewStoryProcess?.(formObject).then((data) => {
//               console.log("startNewStoryProcess resolved with data:", data);

//               console.log("Calling loadPlayer with:", {
//                   speech: sm.actions.speechAudio,
//                   background: sm.actions.backgroundAudio,
//                   dt: data
//               });
//               sm.actions.loadPlayer?.({
//                   speech: sm.actions.speechAudio,
//                   background: sm.actions.backgroundAudio,
//                   dt: data
//               });
//           });
//           break;

//       case AudioSm.StateId.PLAYING:
//           console.log("Entering PLAYING state, previousState:", AudioSm.stateIdToString(sm.previousState));
//           if (sm.previousState === AudioSm.StateId.PAUSED) {
//               console.log("Resuming all audio");
//               sm.actions.resumeAllAudio?.();
//           } else {
//               console.log("Starting speech and music");
//               console.log("Speech URL:", sm.actions.speechAudio);
//               console.log("Music URL:", sm.actions.backgroundAudio);
//               sm.actions.startSpeech?.();
//               sm.actions.startMusic?.();
//           }
//           console.log("Syncing all audio");
//           sm.actions.syncAll?.();
//           console.log("Removing blur and updating redDots");
//           sm.actions.removeBlur?.();
//           sm.actions.redDots?.();
//           break;
          
//       case AudioSm.StateId.REPLAYING:
//           console.log("Starting speech and music (REPLAYING)");
//           sm.actions.startSpeech?.();
//           sm.actions.startMusic?.();

//       case AudioSm.StateId.PAUSED:
//           console.log("Pausing all audio and adding blur");
//           sm.actions.pauseAllAudio?.();
//           sm.actions.addBlurr?.();
//           break;

//       case AudioSm.StateId.TEXT_DISPLAYED:
//           console.log("Updating UI for TEXT_DISPLAYED");
//           sm.actions.hideLoadingAnimation?.();
//           sm.actions.streamText?.();
//           sm.actions.handleWordClick?.();
//           sm.actions.handleMouseMove?.();
//           sm.actions.handleMouseOut?.();
//           sm.actions.findNextWordSpan?.();
//           sm.actions.clearHighlights?.();
//           break;
//   }
// }
