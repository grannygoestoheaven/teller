import { elements } from "./config.js";

export function showLoadingAnimation() {
  
  // Access elements via the imported 'elements' store
  const dotsContainer = elements.dotsContainer;
  const dots = elements.dots;
  const period1 = elements.period1;
  const period2 = elements.period2;
  const period3 = elements.period3;
  
  // 1. Show the containers
  dotsContainer.style.display = 'flex';
  dots.style.display = 'flex'; 
  
  // 2. Reset dot classes (assuming these keys exist in 'elements')
  period1.className = 'period period-1';
  period2.className = 'period period-2';
  period3.className = 'period period-3';
  
  // 3. Remove listeners (using the correct element references)
  period1.onclick = null;
  period2.onclick = null;
  period3.onclick = null;
}

// Function to hide the loading animation
export function hideLoadingAnimation() {
  elements.dotsContainer.style.display = 'none'; // Hide the entire container
  elements.dots.style.display = 'none'; // Hide the animation dots
}

export function getRedColor() {
  let arrayOfRedShades = ["#fb2943", "#e2253c", "#c92136", "#b01d2f", "#971928"];
  // Example: red color
  return Math.random(arrayOfRedShades) < 0.5 ? arrayOfRedShades[Math.floor(Math.random() * arrayOfRedShades.length)] : "#FF0000";
}

export function redDots() {
  const color = getRedColor(); // generate a color
  elements.dots.style.setProperty("--period-color", color); // set CSS variable to make the dots turn red
}

export function addBlurr() {
  elements.dots.classList.add('blur-overlay')
}
export function removeBlurr() { 
  elements.dots.classList.remove('blur-overlay')
}
