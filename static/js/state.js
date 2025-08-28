// state.js
export let appState = {
  input:{ focused:false, text:"" },
  player:{ status:"stopped" }
};

export function reducer(state, event) {
  if(event.type === "INPUT_CHANGED") {
    return {input:{focused:state.input.focused,text:event.text}, player:{status:state.player.status}};
  }
  if(event.type === "FOCUS") {
    return {input:{focused:true,text:state.input.text}, player:{status:state.player.status}};
  }
  if(event.type === "SUBMIT") {
    return {input:{focused:false,text:state.input.text}, player:{status:"loading"}};
  }
  if(event.type === "AUDIO_STARTED") {
    return {input:{focused:state.input.focused,text:state.input.text}, player:{status:"playing"}};
  }
  if(event.type === "PLAY_TOGGLE") {
    let n = state.player.status === "playing" ? "paused" : "playing";
    return {input:{focused:state.input.focused,text:state.input.text}, player:{status:n}};
  }
  if(event.type === "AUDIO_ENDED") {
    return {input:{focused:state.input.focused,text:state.input.text}, player:{status:"stopped"}};
  }
  if(event.type === "REPLAY") {
    return {input:{focused:state.input.focused,text:state.input.text}, player:{status:"loading"}};
  }
  
  return state;
}
// export const appState = {
//     playerState: "idle",
//     isInputEmpty: true,
//     isChatHistoryTextVisible: false,
//     isLoadingAnimationVisible: false,
//   };
  
//   // Function to update the form state in the UI
// export function updatePlayerState(newPlayerState) {
//   appState.playerState = newPlayerState;
//   updatePlayerUI(appState.playerState); // Tell the view to update its display
// }

// export function updateInputState(isEmpty) {
//   appState.isInputEmpty = isEmpty;
//   updateFormUI(appState.isInputEmpty); // Tell the view to update its display
// }

