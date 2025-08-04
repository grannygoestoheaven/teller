export function saveStoryToStorage(entry) {
  const key   = 'tellerStories';
  const stash = JSON.parse(localStorage.getItem(key) || '[]');
  stash.unshift(entry);
  // optional: cap length
  localStorage.setItem(key, JSON.stringify(stash.slice(0, 50)));
}

export function loadStoryFromStorage() {
  return JSON.parse(localStorage.getItem('tellerStories') || '[]');
}
