export function getColor() {
    // Example: random color
    const letters = "0123456789ABCDEF";
    let color = "#";
    for(let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

export function makeFlashy(hslColor) {
    // Extract H, S, L values from hsl(h, s%, l%)
    const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);

    // Boost saturation and adjust lightness for "flashiness"
    const flashyS = Math.min(100, s * 1.4); // Increase saturation
    const flashyL = Math.max(30, l * 0.7);  // Decrease lightness (but not too dark)

    return `hsl(${h}, ${Math.round(flashyS)}%, ${Math.round(flashyL)}%)`;
}

export function getGreenColor() {
    const greenShades = [
      "hsl(120, 61%, 34%)",
      "hsl(120, 70%, 40%)",
      "hsl(120, 75%, 45%)",
      "hsl(120, 80%, 50%)",
      "hsl(120, 85%, 55%)",
      "hsl(120, 90%, 60%)",
      "hsl(120, 95%, 65%)",
      "hsl(120, 100%, 30%)",
      "hsl(120, 100%, 35%)",
      "hsl(120, 100%, 40%)",
      "hsl(120, 100%, 45%)",
      "hsl(120, 100%, 50%)",
      "hsl(120, 80%, 30%)",
      "hsl(120, 80%, 35%)",
      "hsl(120, 80%, 40%)",
      "hsl(120, 80%, 45%)",
      "hsl(120, 80%, 50%)",
      "hsl(120, 70%, 30%)",
      "hsl(120, 70%, 35%)",
      "hsl(120, 70%, 40%)",
      "hsl(120, 70%, 45%)",
      "hsl(120, 70%, 50%)",
      "hsl(120, 60%, 30%)",
      "hsl(120, 60%, 35%)",
      "hsl(120, 60%, 40%)",
      "hsl(120, 60%, 45%)",
      "hsl(120, 60%, 50%)"
     ]
    return greenShades[Math.floor(Math.random() * greenShades.length)];
}

export function getRedGoldenrodColor() {
    // const redShades = ["#8B0000", "#A52A2A", "#B22222", "#DC143C", "#FF4500", "#D2691E", "#CD853F", "#DAA520", "#B8860B", "#F4A460"];
    const goldenRedShades = [
      "hsl(0, 100%, 27%)",
      "hsl(0, 59%, 41%)",
      "hsl(0, 68%, 42%)",
      "hsl(348, 83%, 47%)",
      "hsl(16, 100%, 50%)",
      "hsl(25, 75%, 47%)",
      "hsl(30, 59%, 53%)",
      "hsl(43, 74%, 49%)",
      "hsl(43, 89%, 38%)",
      "hsl(28, 87%, 67%)"
      ];
    return goldenRedShades[Math.floor(Math.random() * goldenRedShades.length)];
  }

export function getBluePinkColor() {
    const bluePinkShades = ["#4682B4", "#5F9EA0", "#6A5ACD", "#7B68EE", "#8470FF", "#DB7093", "#FF69B4", "#FFB6C1", "#FFC0CB", "#E6E6FA"];
    return bluePinkShades[Math.floor(Math.random() * bluePinkShades.length)];
}

export function getGreenBrownColor() {
    const greenBrownShades = ["#228B22", "#2E8B57", "#6B8E23", "#808000", "#8FBC8F", "#556B2F", "#654321", "#8B4513", "#A0522D", "#CD853F"];
    return greenBrownShades[Math.floor(Math.random() * greenBrownShades.length)];
}

export function getEarthToneColor() {
    let earthToneShades = ["#ab714a", "#6adc99", "#a03d41", "#dfd9cf", "#dadcd3"];
    // Example: earth‐tone fallback
    return Math.random() < 0.5
      ? earthToneShades[Math.floor(Math.random() * earthToneShades.length)]
      : "#ab714a";
  }
  
  export function getSoftPastelColor() {
    let pastelShades = ["#748697", "#cecbae", "#aee4eb", "#ffde9f"];
    // Example: pastel‐tone fallback
    return Math.random() < 0.5
      ? pastelShades[Math.floor(Math.random() * pastelShades.length)]
      : "#748697";
  }
  
  export function getRedColor() {
    let arrayOfRedShades = ["#fb2943", "#e2253c", "#c92136", "#b01d2f", "#971928"];
    // Example: red color
    return Math.random(arrayOfRedShades) < 0.5 ? arrayOfRedShades[Math.floor(Math.random() * arrayOfRedShades.length)] : "#FF0000";
  }
