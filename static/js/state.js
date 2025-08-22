// state.js
export const appState = {
    playerState: "idle",
    isInputEmpty: true,
    isChatHistoryTextVisible: false,
    isLoadingAnimationVisible: false,
  };
  
  // Function to update the form state in the UI
export function updatePlayerState(newPlayerState) {
  appState.playerState = newPlayerState;
  updatePlayerUI(appState.playerState); // Tell the view to update its display
}

export function updateInputState(isEmpty) {
  appState.isInputEmpty = isEmpty;
  updateFormUI(appState.isInputEmpty); // Tell the view to update its display
}
