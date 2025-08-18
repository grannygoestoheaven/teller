// The central state management function
function updatePlayerState(newState) {
    appState.playerState = newState;
    updatePlayerUI(appState); // Tell the view to update its display
  }

  // The main action router.
function handleUserAction(action) {
    // Check the form's state first. This has the highest priority.
    if (appState.formIsNotEmpty && (action === 'playPauseClick' || action === 'submit')) {
      startNewStoryProcess();
    } else if (action === 'playPauseClick') {
      // Logic for playing and pausing an existing story.
      if (appState.playerState === 'playing') {
        speechAudio.pause();
        backgroundAudio.pause();
      } else if (appState.playerState === 'paused' || appState.playerState === 'ready') {
        speechAudio.play();
        backgroundAudio.play();
      }
    } else if (action === 'replayClick') {
      // Logic for replaying a finished story.
      speechAudio.currentTime = 0;
      backgroundAudio.currentTime = 0;
      speechAudio.play();
      backgroundAudio.play();
    } else if (action === 'speechEnded') {
      // The story is over, but the background track might continue.
      updatePlayerState('ended');
      // Display the story text.
    }
  }

  // The function that communicates with the backend.
async function startNewStoryProcess() {
    chatHistory.innerHTML = '' ; // Clear previous chat history
    updatePlayerState('loading');
    const formData = new FormData(form);
  
    // Fetch from the backend.
    const response = await fetch('/generate_story', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    const audioUrl = data.audio_url;
    const storyText = data.story_text;
    
    // Update audio elements with the new data.
    speechAudio.src = audioUrl;

    // The background track is the first to play.
    backgroundAudio.play();
    // We immediately update the state to reflect that something is playing.
    updatePlayerState('playing'); 
    
    // Set a timeout for the speech track.
    setTimeout(() => {
        speechAudio.play();
    }, 5000); // 5000ms delay.
}
