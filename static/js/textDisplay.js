import { elements, lastStoryData } from "./config.js";

export function displayStoryText() {
    elements.storyText.textContent = lastStoryData.story;
}
