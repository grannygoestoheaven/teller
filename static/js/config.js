export const elements = {}; // the elements object is defined in main.js
export let lastStoryData = {}; // the lastStoryData object is assigned in storyService.js
export let lastTopicData = {}; // the lastTopicData object is assigned in storyService.js
export let currentFormInputValue = ''; // to track the current value of the form input, will be updated on input events in ui.js

// export let fullSubjects = []; // for later use, will be populated from subjects files in relation to the Topic the user would have clicked onto.
// export let compactSubjects = []; // for later use, will be populated from subjects files - in a compacted version - in relation to the Topic the user would have clicked onto.

// Global variables
let squaresPerWidth = 5; // Default squares per width
let gridValues = new Map(); // { id: { value: string, size: string } }
let isGridVisible = true; // Default visibility
let isChatVisible = false; // Default chat visibility
let areDotsVisible = false; // Default dots visibility
let isGridFilled = false; // To track if the grid is filled
let isTextHighlighted = false; // To track if text is highlighted
let currentPlayingSquare = null;
let squareClickAuthorized = false; // To control when squares can be clicked
let squareValues = []; // Array to hold values for each square
let lastFilledSquares = new Set(); // Set to track if each square has data
let usedTitles = new Set(); // To track used titles and prevent duplicates

// Getters
export function getGridSize() { return gridSize; }
export function getSquaresPerWidth() { return squaresPerWidth; }
export function getGridValues() { return gridValues; }
export function getIsGridVisible() { return isGridVisible; }
export function getIsChatVisible() { return isChatVisible; }
export function getAreDotsVisible() { return areDotsVisible; }
export function getIsGridFilled() { return isGridFilled; }
export function getSquaresValuesList() { return squareValues; }
export function getLastFilledSquares() { return lastFilledSquares; }
export function getUsedTitles() { return usedTitles; }
export function getCurrentPlayingSquare() { return currentPlayingSquare; }
export function getSquareClickAuthorized() { return squareClickAuthorized; }
export function getIsTextHighlighted() { return isTextHighlighted; }

// Setters
export function setGridSize(value) { gridSize = value; }
export function setGridValues(value) { gridValues = value; }
export function setIsGridVisible(value) { isGridVisible = value; }
export function setIsChatVisible(value) { isChatVisible = value; }
export function setAreDotsVisible(value) { areDotsVisible = value; }
export function setSquareClickAuthorized(value) { squareClickAuthorized = value; }
export function setIsTextHighlighted(value) { isTextHighlighted = value; }
