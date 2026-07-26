// Crux click sound.
//
// Synthesised rather than loaded. An .mp3 would make every artifact that uses it
// non-portable - the sound breaks the moment the file is exported or opened
// standalone, which is exactly when a Crux artifact is most likely to travel. This
// is a few hundred bytes and has no dependencies.
//
//   import { attachClickSound } from "./sound.js";
//   attachClickSound();                       // every .crux-btn on the page
//   attachClickSound({ selector: "[data-sound]" });
//
// Or paste the body inline for a standalone artifact.

const STORAGE_KEY = "crux-sound-on";

let ctx;

/**
 * Play the Crux click. Safe to call on every press.
 * @param {{ freq?: number, gain?: number }} [options]
 */
export function playClick({ freq = 760, gain = 0.2 } = {}) {
  if (!soundEnabled()) return;
  try {
    // Created lazily: browsers refuse an AudioContext until a user gesture, and a
    // press is that gesture. Constructing it at import time would leave a
    // permanently suspended context on pages where nobody ever clicks.
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = "triangle";

    // A slight downward glide. A flat tone reads as a beep; a falling one reads
    // as a pop, which is what makes it feel like a physical button.
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.72, t + 0.07);

    // Never start or stop at zero gain abruptly. An instantaneous amplitude edge
    // is itself an audible click, which would defeat the point of the sound.
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);

    osc.connect(amp).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  } catch {
    // Audio is decoration. It must never break the interface it decorates.
  }
}

/** Is sound currently on? Defaults to on; the user's choice persists per tab. */
export function soundEnabled() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== "0";
  } catch {
    return true;
  }
}

/** Turn sound on or off and remember it. */
export function setSoundEnabled(on) {
  try {
    sessionStorage.setItem(STORAGE_KEY, on ? "1" : "0");
  } catch {
    // Private-mode storage failures are not worth surfacing.
  }
  if (on) playClick({ freq: 660, gain: 0.16 });
}

/**
 * Wire the click sound to every matching control.
 * Uses pointerdown, not click, so the sound lands with the press rather than the
 * release - a sound on release feels detached from the button that caused it.
 */
export function attachClickSound({ selector = ".crux-btn", root = document } = {}) {
  for (const el of root.querySelectorAll(selector)) {
    el.addEventListener("pointerdown", () => playClick());
  }
}
