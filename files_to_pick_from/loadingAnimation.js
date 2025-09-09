let loadingAnimationContainer;
let loadingAnimation;
let period1;
let period2;
let period3;

export function initLoadingElements(container, animation, p1, p2, p3) {
  loadingAnimationContainer = container;
  loadingAnimation = animation;
  period1 = p1;
  period2 = p2;
  period3 = p3;
}

export function showLoadingAnimation() {
  loadingAnimationContainer.style.display = 'flex';
  loadingAnimation.style.display = 'flex';

  // Reset classes so the CSS animation restarts
  period1.className = 'period period-1';
  period2.className = 'period period-2';
  period3.className = 'period period-3';

  // Remove any leftover click handlers on the dots
  period1.onclick = null;
  period2.onclick = null;
  period3.onclick = null;
}

export function hideLoadingAnimation() {
  loadingAnimationContainer.style.display = 'none';
  loadingAnimation.style.display = 'none';
}

export function getRedColor() {
  const arrayOfRedShades = ["#fb2943", "#e2253c", "#c92136", "#b01d2f", "#971928"];
  return arrayOfRedShades[Math.floor(Math.random() * arrayOfRedShades.length)];
}

export function redDots() {
  const color = getRedColor();
  loadingAnimation.style.setProperty("--period-color", color);
}

export function addBlurr() {
  loadingAnimation.classList.add('blur-overlay');
}

export function removeBlurr() { 
  loadingAnimation.classList.remove('blur-overlay');
}
