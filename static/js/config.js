export const elements = {}; // the elements object is defined in main.js
export let lastStoryData = {}; // the lastStoryData object is defined in storyService.js

// Global variables
let gridSize = 6; // Default size
let squaresPerWidth = 11; // Default squares per width
let gridValues = new Map(); // { id: { value: string, size: string } }
let isGridVisible = true; // Default visibility

// Getters
export function getGridSize() { return gridSize; }
export function getSquaresPerWidth() { return squaresPerWidth; }
export function getGridValues() { return gridValues; }
export function getIsGridVisible() { return isGridVisible; }

// Setters
export function setGridSize(value) { gridSize = value; }
export function setGridValues(value) { gridValues = value; }
export function setIsGridVisible(value) { isGridVisible = value; }
