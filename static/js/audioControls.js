// let speechAudio;
// let backgroundAudio;

// // Internal variables to store timeout/interval IDs
// let bgFadeInIntervalId = null;
// let bgFadeOutIntervalId = null;
// let speechDelayTimeoutId = null;
// let speechAudioOnEndedTimeoutId = null;

// export function initAudioElements(speechEl, backgroundEl) {
//     speechAudio = speechEl;
//     backgroundAudio = backgroundEl;
// }

// // --- New functions to clear intervals/timeouts ---
// export function clearAllAudioTimeouts() {
//     if (bgFadeInIntervalId) {
//         clearInterval(bgFadeInIntervalId);
//         bgFadeInIntervalId = null; // Clear reference
//     }
//     if (bgFadeOutIntervalId) {
//         clearInterval(bgFadeOutIntervalId);
//         bgFadeOutIntervalId = null; // Clear reference
//     }
//     if (speechDelayTimeoutId) {
//         clearTimeout(speechDelayTimeoutId);
//         speechDelayTimeoutId = null; // Clear reference
//     }
//     if (speechAudioOnEndedTimeoutId) {
//         clearTimeout(speechAudioOnEndedTimeoutId);
//         speechAudioOnEndedTimeoutId = null; // Clear reference
//     }
// }

// export function restartSpeech() {
//     clearAllAudioTimeouts(); // Clear everything before restarting

//     // Ensure background audio volume is reset and playing
//     if (backgroundAudio.src) { // Only try to play if a source is set
//         backgroundAudio.volume = 0.3; // Set to 30% volume for background
//         backgroundAudio.currentTime = 0;
//         console.log(`Restarting speech. Setting background volume to: ${backgroundAudio.volume}`);
//     }

//     // Restart speech audio
//     if (speechAudio.src) { // Only try to play if a source is set
//         speechAudio.currentTime = 0;
//         speechAudio.play().catch(e => console.error("Speech audio restart failed:", e));
//     }
//     // updatePlayPauseIcon(); // Not used/implemented, can be removed if not needed elsewhere
// }

// export function togglePlayPauseSpeech() {
//     if (speechAudio.paused) {
//         if (speechAudio.src) {
//             speechAudio.play().catch(e => console.error("Speech audio play failed:", e));
//         }
//         // Ensure background audio is also playing if speech starts
//         if (backgroundAudio.paused && backgroundAudio.src) {
//             backgroundAudio.play().catch(e => console.error("Background audio play failed:", e));
//         }
//     } else {
//         speechAudio.pause();
//         // backgroundAudio.pause(); // Uncomment to pause background with speech
//     }
//     // updatePlayPauseIcon(); // Not used/implemented
// }

// export function updatePlayPauseIcon() {
//     // This function is kept for API compatibility but does nothing currently.
// }

// export function handleAudioPlayback(data) {
//     // Clear any existing audio operations before starting new ones
//     clearAllAudioTimeouts();

//     if (data.has_audio && data.audio_url) {
//         speechAudio.src = data.audio_url;
//         speechAudio.volume = 1.0; // Set speech volume to 100%

//         if (data.track_url) {
//             backgroundAudio.src = data.track_url;
//             backgroundAudio.volume = 0; // Start muted for fade-in
            
//             const maxVolume = 0.3; // Max volume set to 30% for background
//             const fadeInDuration = 10000; // 10 seconds
//             const intervalMs = 50;
//             const steps = fadeInDuration / intervalMs;
//             const volumeIncreasePerStep = maxVolume / steps;
//             let bgVolume = 0; // This will track the target volume for each step
            
//             bgFadeInIntervalId = setInterval(() => {
//                 bgVolume += volumeIncreasePerStep;
//                 if (bgVolume >= maxVolume) {
//                     backgroundAudio.volume = maxVolume; // Set to final volume
//                     console.log(`Background audio fade-in complete. Final volume: ${backgroundAudio.volume}`);
//                     clearInterval(bgFadeInIntervalId);
//                     bgFadeInIntervalId = null;
                    
//                     // Wait 5 seconds, then play speech
//                     speechDelayTimeoutId = setTimeout(() => {
//                         speechAudio.play().catch(e => {
//                             console.error("Speech audio playback failed:", e);
//                             const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
//                             document.dispatchEvent(event);
//                         });
//                     }, 5000); // 5-second delay
//                 } else {
//                     backgroundAudio.volume = bgVolume;
//                     console.log(`Fading in background audio. Current volume: ${backgroundAudio.volume}`);
//                 }
//             }, intervalMs);
//             backgroundAudio.play().catch(e => console.error("Background audio playback failed:", e));
            
//             // Function to handle speech end and cleanup
//             speechAudio.onended = () => {
//                 // Dispatch event to show story text immediately
//                 const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
//                 document.dispatchEvent(event);

//                 // Wait for 40 seconds, then fade out
//                 speechAudioOnEndedTimeoutId = setTimeout(() => {
//                     let fadeOutVolume = backgroundAudio.volume;
//                     const fadeOutDuration = 35000;
//                     const fadeOutSteps = fadeOutDuration / intervalMs;
//                     const volDecrement = fadeOutVolume / fadeOutSteps;

//                     bgFadeOutIntervalId = setInterval(() => {
//                         fadeOutVolume -= volDecrement;
//                         if (fadeOutVolume <= 0) {
//                             backgroundAudio.volume = 0;
//                             clearInterval(bgFadeOutIntervalId);
//                             bgFadeOutIntervalId = null;
//                             backgroundAudio.pause();
//                             backgroundAudio.currentTime = 0;
//                         } else {
//                             backgroundAudio.volume = fadeOutVolume;
//                         }
//                     }, intervalMs);
//                 }, 40000); // 40-second ambient period
//             };
//         } else { // No background track
//             // Just play speech directly
//             speechAudio.play().catch(e => {
//                 console.error("Speech audio playback failed:", e);
//                 // Dispatch speechEnded even if playback fails
//                 const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
//                 document.dispatchEvent(event);
//             });
//             speechAudio.onended = () => {
//                 clearAllAudioTimeouts(); // Clear relevant timeouts
//                 // Ensure background is off if no track was loaded
//                 backgroundAudio.pause();
//                 backgroundAudio.currentTime = 0;
//                 // --- Also dispatch speechEnded if no background audio was involved ---
//                 const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
//                 document.dispatchEvent(event);
//             };
//         }
//     } else { // No audio link provided at all
//         console.warn('No audio link provided for the story.');
//         // If no audio, still signal that 'speech' (or content readiness) is done
//         const event = new CustomEvent('speechEnded', { detail: { storyText: data.story } });
//         document.dispatchEvent(event);
//     }
// }

let ctx, speechEl, bgEl;
let speechGain, bgGain;
let speechSource, bgSource;

const POST_DELAY = 3;
const BG_LINGER = 45;
const BG_FADE_IN = 5000;   // in ms for setInterval
const BG_FADE_OUT = 30000; // in ms
const BG_TARGET_GAIN = 0.3;

let bgFadeInterval = null;

export function initAudioElements({ speech, background }) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    speechEl = speech;
    bgEl = background;

    speechSource = ctx.createMediaElementSource(speechEl);
    bgSource = ctx.createMediaElementSource(bgEl);

    speechGain = ctx.createGain();
    bgGain = ctx.createGain();

    speechGain.gain.value = 0;
    bgGain.gain.value = 0;

    speechSource.connect(speechGain).connect(ctx.destination);
    bgSource.connect(bgGain).connect(ctx.destination);
}

// export async function handleAudioPlayback(data) {
//     speechEl.src = data.audio_url;
//     bgEl.src = data.track_url;

//     await speechEl.load();
//     await bgEl.load();

//     speechEl.currentTime = 0;
//     bgEl.currentTime = 0;
//     bgEl.loop = true;

//     speechGain.gain.setValueAtTime(0, ctx.currentTime);
//     bgGain.gain.setValueAtTime(0, ctx.currentTime);

//     await ctx.resume();
//     bgEl.play();
//     speechEl.play();

//     // Simple smooth fade-in (Web Audio ramp)
//     speechGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.2);
//     fadeBgTo(0.3, 5000);
// }

// export async function handleAudioPlayback(data) {
//     speechEl.src = data.audio_url;
//     bgEl.src = data.track_url;

//     await speechEl.load();
//     await bgEl.load();

//     speechEl.currentTime = 0;
//     bgEl.currentTime = 0;
//     bgEl.loop = false;

//     speechGain.gain.setValueAtTime(0, ctx.currentTime);
//     bgGain.gain.setValueAtTime(0, ctx.currentTime);

//     await ctx.resume();
//     bgEl.play();

//     // 🎵 Background fade-in via setInterval
//     fadeGainViaInterval(bgGain, BG_TARGET_GAIN, BG_FADE_IN);

//     // 🎙️ Start speech after BG_FADE_IN + POST_DELAY
//     const delay = BG_FADE_IN + POST_DELAY * 1000;

//     setTimeout(() => {
//         speechEl.play();
//         speechGain.gain.setValueAtTime(0, ctx.currentTime);
//         speechGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.2); // Quick fade
//     }, delay);

//     // 🧠 Speech end logic
//     speechEl.onended = () => {
//         document.dispatchEvent(new CustomEvent('speechEnded', {
//             detail: { storyText: data.story }
//         }));

//         // Wait BG_LINGER then fade out BG slowly
//         setTimeout(() => {
//             fadeGainViaInterval(bgGain, 0, BG_FADE_OUT);

//             // Optional: pause after fade ends
//             setTimeout(() => {
//                 bgEl.pause();
//             }, BG_FADE_OUT);
//         }, BG_LINGER * 1000);
//     };
// }

export async function handleAudioPlayback(data) {
    speechEl.src = data.audio_url;
    bgEl.src = data.track_url;

    await speechEl.load();
    await bgEl.load();

    speechEl.currentTime = 0;
    bgEl.currentTime = 0;
    bgEl.loop = false;

    // 🧼 Reset native volumes (Web Audio handles actual gain)
    speechEl.volume = 1.0;
    bgEl.volume = 1.0;

    await ctx.resume();

    // 🎛 Confirm gain routing is working
    console.log("🔊 [PRE-PLAY] bgGain value:", bgGain.gain.value);

    // 🧱 Hard reset gain to 0 and fade to 0.3
    bgGain.gain.setValueAtTime(0, ctx.currentTime);
    fadeGainViaInterval(bgGain, BG_TARGET_GAIN, BG_FADE_IN);

    bgEl.play().then(() => {
        console.log("🎶 Background audio playing...");
    }).catch(err => console.error("❌ BG play error:", err));

    // 🕒 Wait, then play speech
    const delay = BG_FADE_IN + POST_DELAY * 1000;
    setTimeout(() => {
        console.log("🗣 Starting speech...");
        speechEl.play();
        speechGain.gain.setValueAtTime(0, ctx.currentTime);
        speechGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.2);
    }, delay);

    speechEl.onended = () => {
        document.dispatchEvent(new CustomEvent('speechEnded', {
            detail: { storyText: data.story }
        }));

        setTimeout(() => {
            console.log("🎚 Starting BG fade-out...");
            fadeGainViaInterval(bgGain, 0, BG_FADE_OUT);

            setTimeout(() => {
                bgEl.pause();
                console.log("⏹ BG paused.");
            }, BG_FADE_OUT);
        }, BG_LINGER * 1000);
    };
}


// function fadeGainViaInterval(gainNode, target, duration) {
//     clearInterval(bgFadeInterval);

//     const steps = 60;
//     const stepTime = duration / steps;
//     const start = gainNode.gain.value;
//     const delta = target - start;
//     let currentStep = 0;

//     bgFadeInterval = setInterval(() => {
//         currentStep++;
//         const newVal = start + (delta * currentStep) / steps;
//         gainNode.gain.setValueAtTime(newVal, ctx.currentTime);

//         if (currentStep >= steps) {
//             clearInterval(bgFadeInterval);
//             gainNode.gain.setValueAtTime(target, ctx.currentTime);
//         }
//     }, stepTime);
// }

function fadeGainViaInterval(gainNode, target, duration) {
    clearInterval(bgFadeInterval);

    const steps = 60;
    const stepTime = duration / steps;
    const start = gainNode.gain.value;
    const delta = target - start;
    let currentStep = 0;

    console.log(`🎚 Fading from ${start} to ${target} over ${duration}ms`);

    bgFadeInterval = setInterval(() => {
        currentStep++;
        const newVal = start + (delta * currentStep) / steps;
        gainNode.gain.setValueAtTime(newVal, ctx.currentTime);

        console.log(`🔁 Step ${currentStep}: gain = ${newVal.toFixed(3)}`);

        if (currentStep >= steps) {
            gainNode.gain.setValueAtTime(target, ctx.currentTime);
            console.log(`✅ Fade done. Final gain: ${target}`);
            clearInterval(bgFadeInterval);
        }
    }, stepTime);
}


export async function togglePlayPauseSpeech() {
    await ctx.resume();

    if (speechEl.paused) {
        speechEl.play();
        bgEl.play();

        // Smooth ramp back in — NOT from 0
        speechGain.gain.setValueAtTime(speechGain.gain.value, ctx.currentTime);
        speechGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.2);

        bgGain.gain.setValueAtTime(bgGain.gain.value, ctx.currentTime);
        bgGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.5);
    } else {
        speechEl.pause();
        bgEl.pause();

        speechGain.gain.cancelScheduledValues(ctx.currentTime);
        speechGain.gain.setValueAtTime(speechGain.gain.value, ctx.currentTime);

        bgGain.gain.cancelScheduledValues(ctx.currentTime);
        bgGain.gain.setValueAtTime(bgGain.gain.value, ctx.currentTime);
    }
}

// export async function togglePlayPauseSpeech() {
//     await ctx.resume();

//     if (speechEl.paused) {
//         speechEl.play();
//         bgEl.play();
//         speechGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
//         fadeBgTo(0.3, 3000);
//     } else {
//         speechEl.pause();
//         bgEl.pause();

//         speechGain.gain.cancelScheduledValues(ctx.currentTime);
//         speechGain.gain.setValueAtTime(speechGain.gain.value, ctx.currentTime);

//         bgGain.gain.cancelScheduledValues(ctx.currentTime);
//         bgGain.gain.setValueAtTime(bgGain.gain.value, ctx.currentTime);

//         clearInterval(bgFadeInterval);
//     }
// }

function fadeBgTo(target, duration) {
    clearInterval(bgFadeInterval);
    const steps = 30;
    const stepTime = duration / steps;
    const stepSize = (target - bgGain.gain.value) / steps;

    bgFadeInterval = setInterval(() => {
        const newVal = bgGain.gain.value + stepSize;
        bgGain.gain.setValueAtTime(newVal, ctx.currentTime);

        const done =
            (stepSize > 0 && newVal >= target) ||
            (stepSize < 0 && newVal <= target);

        if (done) {
            bgGain.gain.setValueAtTime(target, ctx.currentTime);
            clearInterval(bgFadeInterval);
        }
    }, stepTime);
}
