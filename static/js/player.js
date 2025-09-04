// Import necessary modules and functions
import { updatePlayerState, formInputState, updateChatHistoryState, onTextDataReceived } from './view.js';
import { saveStoryToStorage } from './storage';
import { clearPlaybackTimers } from './utils.js';
import { sm } from './smStore.js';

// The main event router.
export function handleAppEvent(event, form = null) {
    // Check the form's state first. This has the highest priority.
    if (appState.isInputEmpty && (event === 'playPauseClick' || event === 'submit')) {
      startNewStoryProcess(form);
    } else if (event === 'playPauseClick') {
      // Logic for playing and pausing an existing story.
      if (appState.playerState === 'playing') {
        updatePlayerState('paused');
        speechAudio.pause();
        backgroundAudio.pause();
      } else if (appState.playerState === 'paused' || appState.playerState === 'ready') {
        updatePlayerState('playing');
        speechAudio.play();
        backgroundAudio.play();
      }
    } else if (event === 'replayClick') {
      // Logic for replaying a finished story.
      speechAudio.currentTime = 0;
      backgroundAudio.currentTime = 0;
      updatePlayerState('playing');
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
    clearPlaybackTimers(); // Clear any previous playback timers.
    chatHistory.innerHTML = '' ; // Clear previous chat history
    updateChatHistoryState(); // Update the chat history state to reflect the cleared history.
    updatePlayerState('loading');

    const data = await fetchStoryFromBackend(form);
    updatePlayerState('ready');

    await playStory(data);
    updatePlayerState('playing');
}

export async function fetchStoryFromBackend(form) {
    // Fetch from the backend.
    const formData = new FormData(form);
    const subject = formData.get('subject').trim(); // Get the subject from the form data
    formData.append('subject', subject); /* --> I get the subject to use it in the saveStoryToStorage function*/
  
    const response = await fetch('/generate_story', {
      method: 'POST',
      body: formData,
    });

    // Check if the response is ok.
    if (!res.ok) { 
      throw new Error((await res.json()).error || `Error ${res.status}`);
    }

    sm.dispatchEvent(AudioSm.EventId.SPEECH_READY);

    // Update the player state to 'ready' after fetching the story.
    updatePlayerState('ready');
    // Update the form state to reflect that the form is not empty.
    appState.isInputEmpty = true;

    // Parse the JSON response.
    const data = await response.json();

    // Save the story to local storage.
    saveStoryToStorage({
      subject: subject,
      tagged: data.tagged_story,
      human: data.story,
      timestamp: Date.now
    })
    return data
}

export async function playStory(data) {
  const audioUrl = data.audio_url;
  // const storyText = data.story_text;
  if(!audioUrl) {
    
  }
  onTextDataReceived();
    
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
