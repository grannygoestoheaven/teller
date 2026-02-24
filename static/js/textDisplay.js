import { elements, lastStoryData } from "/static/js/config.js";

export function displayStoryText() {
    elements.storyText.textContent = lastStoryData.story;
}
