export const elements = {}; // the elements object is defined in main.js
export let lastStoryData = {}; // the lastStoryData object is assigned in storyService.js
export let lastTopicData = {}; // the lastTopicData object is assigned in storyService.js
export let currentFormInputValue = ''; // to track the current value of the form input, will be updated on input events in ui.js

// export let fullSubjects = []; // for later use, will be populated from subjects files in relation to the Topic the user would have clicked onto.
// export let compactSubjects = []; // for later use, will be populated from subjects files - in a compacted version - in relation to the Topic the user would have clicked onto.

// Global variables
let squaresPerWidth = 7; // Default squares per width
let gridValues = new Map(); // { id: { value: string, size: string } }
let isGridVisible = true; // Default visibility
let isGridFilled = false; // To track if the grid is filled
let isChatVisible = false; // Default chat visibility
let squareValues = []; // Array to hold values for each square
let lastFilledSquares = new Set(); // Set to track if each square has data
let currentPlayingSquare = null;

// Getters
export function getGridSize() { return gridSize; }
export function getSquaresPerWidth() { return squaresPerWidth; }
export function getGridValues() { return gridValues; }
export function getIsGridVisible() { return isGridVisible; }
export function getIsGridFilled() { return isGridFilled; }
export function getIsChatVisible() { return isChatVisible; }
export function getSquaresValuesList() { return squareValues; }
export function getLastFilledSquares() { return lastFilledSquares; }
export function getCurrentPlayingSquare() { return currentPlayingSquare; }

// Setters
export function setGridSize(value) { gridSize = value; }
export function setGridValues(value) { gridValues = value; }
export function setIsGridVisible(value) { isGridVisible = value; }
