export function shuffle(arr) {
    let a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  export function getRandomNoRepeat() {
    if (index === 0 || index >= shuffled.length) {
      shuffled = shuffle(arrayOfRedShades);
      index = 0;
    }
    return shuffled[index++];
  }