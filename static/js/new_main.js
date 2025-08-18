// Get DOM element references (done once)
const form = getElementById('story-form');
const formInput = getElementById('subject'); // Using the correct ID from your HTML
const playPauseButton = getElementById('generateButton'); // Renamed for clarity
const replayButton = getElementById('replayButton');
const loadingAnimationContainer = getElementById('loadingAnimationContainer');
const chatHistory = getElementById('chatHistory');
const speechAudio = getElementById('speechAudio');
const backgroundAudio = getElementById('backgroundAudio');

// Define the central state object
const appState = {
    playerState: 'idle',
    formIsNotEmpty: false,
  };

  // Add Event Listeners
formInput.addEventListener('input', () => {
    // Update appState and trigger UI update
    appState.formIsNotEmpty = formInput.value.length > 0;
    updateFormUI(appState);
  });

  form.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      handleUserAction('submit');
    }
  });

  playPauseButton.addEventListener('click', () => {
    handleUserAction('playPauseClick');
  });
  
  replayButton.addEventListener('click', () => {
    handleUserAction('replayClick');
  });

  // Add listeners for native audio events
speechAudio.addEventListener('play', () => {
    updatePlayerState('playing');
  });
  
  speechAudio.addEventListener('pause', () => {
    updatePlayerState('paused');
  });
  
  speechAudio.addEventListener('ended', () => {
    // A custom event to handle the end of the story.
    handleUserAction('speechEnded');
  });