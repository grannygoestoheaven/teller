// Function to save story to localStorage
export function saveStoryToStorage(story, title) {
    if (story && title) {
        const storyData = {
            content: story,
            title: title,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('lastGeneratedStory', JSON.stringify(storyData));
    }
}

// Function to load story from localStorage
export function loadStoryFromStorage() {
    const savedStory = localStorage.getItem('lastGeneratedStory');
    if (savedStory) {
        try {
            const storyData = JSON.parse(savedStory);
            return {
                story: storyData.content,
                title: storyData.title
            };
        } catch (e) {
            console.error('Error parsing saved story:', e);
            return null;
        }
    }
    return null;
}
