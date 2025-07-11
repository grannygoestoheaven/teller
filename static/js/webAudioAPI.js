/*
  webAudioAPI.js – lightweight three‑track mixer (background, speech, landscape)
  Timing spec:
    • BG fades in 5 s → clamps to 0.30.
    • 3 s after BG hits 0.30, speech begins at 1.0.
    • When speech ends, BG plays 35 s, then fades to 0 over 30 s.
  Public API
    initElements({background,speech,landscape})  → set <audio> elements
    playStory(json)                              → start sequence
    toggleLandscape(vol = 0.4, fade = 1)         → on/off landscape track
*/

// ── constants ────────────────────────────────────────────────────────────
const BG_FADE_IN = 5;      // seconds
const POST_FADE_DELAY = 3; // seconds after fade‑in before speech
const BG_LINGER = 35;      // seconds BG keeps playing after speech
const BG_FADE_OUT = 30;    // seconds BG takes to fade out
const BG_VOL = 0.30;       // target background volume

// ── Web‑Audio plumbing ───────────────────────────────────────────────────
const ctx = new (window.AudioContext || webkitAudioContext)();
let bgEl, speechEl, landEl;
let bgGain, speechGain, landGain;
let landOn = false;

export function initElements({ background, speech, landscape }) {
  bgEl = background;
  speechEl = speech;
  landEl = landscape;

  const bgSrc     = ctx.createMediaElementAudioSourceNode(bgEl);
  const speechSrc = ctx.createMediaElementAudioSourceNode(speechEl);
  const landSrc   = ctx.createMediaElementAudioSourceNode(landEl);

  bgGain     = ctx.createGain();     bgGain.gain.value = 0;
  speechGain = ctx.createGain();     speechGain.gain.value = 1;
  landGain   = ctx.createGain();     landGain.gain.value = 0;

  bgSrc.connect(bgGain).connect(ctx.destination);
  speechSrc.connect(speechGain).connect(ctx.destination);
  landSrc.connect(landGain).connect(ctx.destination);

  // unlock context once
  document.addEventListener('click', () => ctx.resume(), { once: true });
}

export async function playStory(data) {
  if (!bgEl || !speechEl) throw new Error('Call initElements() first');

  /* ─── Background track ─────────────────────────────────────────────── */
  bgEl.src = data.track_url;
  bgEl.loop = true;
  await bgEl.load(); // ensure metadata ready

  const t0 = ctx.currentTime;
  bgGain.gain.cancelScheduledValues(t0);
  bgGain.gain.setValueAtTime(0, t0);
  bgGain.gain.linearRampToValueAtTime(BG_VOL, t0 + BG_FADE_IN);
  bgEl.currentTime = 0;
  bgEl.play();

  /* ─── Speech: start 3 s after fade‑in completes ───────────────────── */
  speechEl.src = data.audio_url;
  await speechEl.load();

  const speechStart = t0 + BG_FADE_IN + POST_FADE_DELAY;
  ctx.resume(); // ensure running
  speechGain.gain.setValueAtTime(1, speechStart);
  setTimeout(() => {
    speechEl.currentTime = 0;
    speechEl.play().catch(e => console.error('speech play err', e));
  }, (speechStart - ctx.currentTime) * 1000);

  /* ─── After speech ends: linger + fade‑out BG ─────────────────────── */
  speechEl.onended = () => {
    const endTime = ctx.currentTime + BG_LINGER;
    bgGain.gain.setValueAtTime(BG_VOL, endTime);
    bgGain.gain.linearRampToValueAtTime(0, endTime + BG_FADE_OUT);
    setTimeout(() => { bgEl.pause(); }, (BG_LINGER + BG_FADE_OUT) * 1000);

    // inform UI text
    document.dispatchEvent(
      new CustomEvent('speechEnded', { detail: { storyText: data.story } })
    );
  };
}

export function toggleLandscape(vol = 0.4, fade = 1) {
  if (!landEl) return;
  landOn = !landOn;
  const now = ctx.currentTime;
  landGain.gain.cancelScheduledValues(now);
  landGain.gain.setValueAtTime(landGain.gain.value, now);
  landGain.gain.linearRampToValueAtTime(landOn ? vol : 0, now + fade);
  if (landOn) landEl.play();
  else setTimeout(() => landEl.pause(), fade * 1000);
}
