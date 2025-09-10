let loadingAnimationContainer;
let loadingAnimation;
let period1;
let period2;
let period3;

// const overlay = document.querySelector('.blur-overlay');
export function initLoadingElements(container, animation, p1, p2, p3, ch) {
  loadingAnimationContainer = container;
  loadingAnimation = animation;
  period2 = p2;
  period1 = p1;
  period3 = p3;
  chatHistory = ch;
}

// Function to show the loading animation
export function showLoadingAnimation() {
  loadingAnimationContainer.style.display = 'flex'; // Show the container
  loadingAnimation.style.display = 'flex'; // Show the animation dots themselves
  // Reset dot classes to ensure animation plays again
  period1.className = 'period period-1';
  period2.className = 'period period-2';
  period3.className = 'period period-3';
  // Remove any interactive listeners that might be lingering
  period1.onclick = null;
  period2.onclick = null;
  period3.onclick = null;
}

// Function to hide the loading animation
export function hideLoadingAnimation() {
    loadingAnimationContainer.style.display = 'none'; // Hide the entire container
    loadingAnimation.style.display = 'none'; // Hide the animation dots
    // No longer transforming dots into controls directly in this module
}

export function getRedColor() {
  let arrayOfRedShades = ["#fb2943", "#e2253c", "#c92136", "#b01d2f", "#971928"];
  // Example: red color
  return Math.random(arrayOfRedShades) < 0.5 ? arrayOfRedShades[Math.floor(Math.random() * arrayOfRedShades.length)] : "#FF0000";
}

export function onTextDataReceived() {
  const color = getRedColor(); // generate a color
  loadingAnimation.setProperty("--period-color", color);
}

export function addBlurr() {
  loadingAnimation.classList.add('blur-overlay')
}
export function removeBlurr() { 
  loadingAnimation.classList.remove('blur-overlay')
}