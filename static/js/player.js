// Import necessary modules and functions
import { updatePlayerUI, updatePlayerState, updateFormState, updateChatHistoryState } from './view';
import { appState } from './state';
import { saveStoryToStorage } from './storage';

// The central state management function
export function updatePlayerState(newState) {
    appState.playerState = newState;
    updatePlayerUI(appState.playerState); // Tell the view to update its display
  }

// The main event router.
export function handleAppEvent(event, form = null) {
    // Check the form's state first. This has the highest priority.
    updateFormState(appState.formIsNotEmpty);
    if (appState.formIsNotEmpty && (event === 'playPauseClick' || event === 'submit')) {
      startNewStoryProcess(form);
    } else if (event === 'playPauseClick') {
      // Logic for playing and pausing an existing story.
      if (appState.playerState === 'playing') {
        speechAudio.pause();
        backgroundAudio.pause();
      } else if (appState.playerState === 'paused' || appState.playerState === 'ready') {
        speechAudio.play();
        backgroundAudio.play();
      }
    } else if (event === 'replayClick') {
      // Logic for replaying a finished story.
      speechAudio.currentTime = 0;
      backgroundAudio.currentTime = 0;
      speechAudio.play();
      backgroundAudio.play();
    } else if (event === 'speechEnded') {
      // The story is over, but the background track might continue.
      updatePlayerState('ended');
      // Display the story text.
    }
  }

// The function that communicates with the backend.
export async function startNewStoryProcess(form) {
    chatHistory.innerHTML = '' ; // Clear previous chat history
    updateChatHistoryState()
    updatePlayerState('loading');
    const formData = new FormData(form);
    const subject = formData.get('subject').trim(); // Get the subject from the form data
    formData.append('subject', subject); /* --> I get the subject to use it in the saveStoryToStorage function*/
  
    // Fetch from the backend.
    const response = await fetch('/generate_story', {
      method: 'POST',
      body: formData,
    });

    // Check if the response is ok.
    if (!res.ok) { 
      throw new Error((await res.json()).error || `Error ${res.status}`);
    }

    const data = await response.json();
    saveStoryToStorage({
      subject: subject,
      tagged: data.tagged_story,
      human: data.story,
      timestamp: Date.now
    })

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
    }, 3000); // 3000ms delay.
}
