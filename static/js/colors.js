export function getColor() {
    // Example: random color
    const letters = "0123456789ABCDEF";
    let color = "#";
    for(let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
  