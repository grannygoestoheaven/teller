export const elements = {} // the elements object is defined in main.js
export const actions = {} // the actions object is defined in StateMachineWrapper.js
export let sm = null; // the state machine instance is created in startStateMachine.js

export let lastStoryData = {
    cleanStory: "",
    taggedStory: "",
    fileName: "",
    hasAudio: Boolean,
    trackUrl: "",
    timestamp: 0
}