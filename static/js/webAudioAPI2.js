// ── constants ────────────────────────────────────────────────────────────
const BG_FADE_IN      = 5;   // seconds
const POST_FADE_DELAY = 3;   // seconds after fade-in before speech
const BG_LINGER       = 35;  // seconds BG keeps playing after speech
const BG_FADE_OUT     = 30;  // seconds BG takes to fade out
const BG_VOL          = 0.20;
// const BG_VOL          = 1;

const ctx = new (window.AudioContext || webkitAudioContext)();
let bgEl, speechEl, landEl;
let bgGain, speechGain, landGain;

export function initElements({ background, speech, landscape }) {
  let initialized = false;  
  if (initialized) return;
  initialized = true;

  bgEl     = background;
  speechEl = speech;
  landEl   = landscape || new Audio();  // silent dummy if none

  const bgSrc     = ctx.createMediaElementSource(bgEl);
  const speechSrc = ctx.createMediaElementSource(speechEl);
  const landSrc   = ctx.createMediaElementSource(landEl);

  bgGain = ctx.createGain();
  bgGain.gain.value = 0;
  speechGain = ctx.createGain();
  speechGain.gain.value = 1;
  landGain = ctx.createGain();
  landGain.gain.value = 0;

  bgSrc.connect(bgGain).connect(ctx.destination);
  speechSrc.connect(speechGain).connect(ctx.destination);
  landSrc.connect(landGain).connect(ctx.destination);

  document.addEventListener('click', () => ctx.resume(), { once: true });
}

export async function playStory(data) {
  console.log(bgGain, speechGain)
  if (!bgEl || !speechEl) throw new Error('Call initElements() first');
  await ctx.resume();                    // ensure context is running
  const t0 = ctx.currentTime;            // ← single time origin

  // ── Background fade-in ────────────────────────────────────────────────
  bgEl.src  = data.track_url;
  bgEl.loop = true;
  await bgEl.load();
  bgEl.currentTime = 0;
  
  // bgGain.gain.cancelScheduledValues(ctx.currentTime);
  bgGain.gain.cancelScheduledValues(t0)
  bgGain.gain.setValueAtTime(0, t0);
  bgGain.gain.linearRampToValueAtTime(BG_VOL, t0 + BG_FADE_IN);
  // bgGain.gain.value = BG_VOL;
  
  bgEl.play().catch(() => {});         // start playback immediately

  // ── Speech start (no timeouts) ────────────────────────────────────────
  speechEl.src = data.audio_url;
  await speechEl.load();
  speechEl.currentTime = 0;

  // Schedule speech play exactly at t0 + BG_FADE_IN + POST_FADE_DELAY
  const speechStart = t0 + BG_FADE_IN + POST_FADE_DELAY;
  // Mute until that moment
  speechGain.gain.cancelScheduledValues(t0);
  // dspeechGain.gain.setValueAtTime(0, t0);
  // speechGain.gain.setValueAtTime(0, speechStart);
  speechGain.gain.linearRampToValueAtTime(1, speechStart + 0.01);
  speechGain.gain.cancelScheduledValues(ctx.currentTime);
  speechGain.gain.value = 1;

  // Use setTimeout only to kick off .play(), but in practice you can also use
  // the Web Audio Scheduling API on a BufferSource. Here we do minimal timeout:
  setTimeout(() => {
    speechEl.play().catch(() => {});
  }, (speechStart - ctx.currentTime) * 1000);

  // ── After speech ends: linger + fade-out BG ─────────────────────────────
  speechEl.onended = () => {
    // const outStart = ctx.currentTime + BG_LINGER;
    // bgGain.gain.cancelScheduledValues(outStart);
    // bgGain.gain.setValueAtTime(BG_VOL, outStart);
    // bgGain.gain.linearRampToValueAtTime(0, outStart + BG_FADE_OUT);
    // no need to pause bgEl; you can if you like:
    // setTimeout(() => bgEl.pause(), (BG_LINGER + BG_FADE_OUT) * 1000);
    bgEl.pause();
    document.dispatchEvent(
      new CustomEvent('speechEnded', { detail: { storyText: data.story } })
    );
  };
}

export async function pauseAudio() {
  await ctx.suspend();
}

export async function resumeAudio() {
  await ctx.resume();
}
