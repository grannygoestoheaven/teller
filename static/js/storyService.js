// storyService.js

export async function startNewStoryProcess(form) {
    // Clear any previous playback timers
    clearPlaybackTimers();
  
    // Get subject
    const formData = new FormData(form);
    const subject = formData.get('subject').trim();
    formData.set('subject', subject);
  
    // Fetch story from backend
    const res = await fetch('/generate_story', { method: 'POST', body: formData });
    if (!res.ok) throw new Error((await res.json()).error || `Error ${res.status}`);
    const data = await res.json();
  
    // Save to local storage
    saveStoryToStorage({
      subject,
      tagged: data.tagged_story,
      human: data.story,
      timestamp: Date.now()
    });

    return data;
  }
  
  // You can still keep these helpers if needed
  function clearPlaybackTimers() {
    // Implementation to clear any active timers
    clearInterval(speechAudio._fadeInterval);
    clearInterval(backgroundAudio._fadeInterval);
    clearTimeout(bgFadeTimeout);
    clearTimeout(bgFadeOutTimeout);
  }
  
  function saveStoryToStorage(storyObj) {
    localStorage.setItem('lastStory', JSON.stringify(storyObj));
  }
  