export const elements = {}; // the elements object is defined in main.js
export let lastStoryData = {}; // the lastStoryData object is assigned in storyService.js
export let lastFieldData = {}; // the lastFieldData object is assigned in storyService.js

// export let fullSubjects = []; // for later use, will be populated from subjects files in relation to the field the user would have clicked onto.
// export let compactSubjects = []; // for later use, will be populated from subjects files - in a compacted version - in relation to the field the user would have clicked onto.

// Global variables
let squaresPerWidth = 5; // Default squares per width
let gridValues = new Map(); // { id: { value: string, size: string } }
let isGridVisible = true; // Default visibility
let isChatVisible = false; // Default chat visibility
let squareValues = []; // Array to hold values for each square
let currentPlayingSquare = null;
let userInput = ""

// Getters
export function getGridSize() { return gridSize; }
export function getSquaresPerWidth() { return squaresPerWidth; }
export function getGridValues() { return gridValues; }
export function getIsGridVisible() { return isGridVisible; }
export function getIsChatVisible() { return isChatVisible; }
export function getSquaresValuesList() { return squareValues; }
export function getCurrentPlayingSquare() { return currentPlayingSquare; }
export function getUserInput() { return userInput; }

// Setters
export function setGridSize(value) { gridSize = value; }
export function setGridValues(value) { gridValues = value; }
export function setIsGridVisible(value) { isGridVisible = value; }
