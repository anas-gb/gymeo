# Database & Services API Reference 📖

This document details Gymeo's data interfaces, internal database logic, level calculations, and synthesizer algorithms.

---

## 🧮 Level Calculations & Math

Gymeo uses a quadratic scale to compute levels. This ensures leveling up becomes increasingly challenging as the user gets stronger:

### 1. XP Needed for Level $N$
Exposed by `getXPForLevel(lvl: number)`:
$$XP_{needed}(N) = N \times 100 + (N - 1) \times 50$$
- Level 1: 100 XP
- Level 2: 250 XP
- Level 3: 500 XP
- Level 4: 800 XP

### 2. Cumulative XP Required for Level $N$
Exposed by `getCumulativeXPForLevel(lvl: number)`:
$$XP_{cumulative}(N) = \sum_{i=1}^{N-1} XP_{needed}(i)$$

---

## 🔥 Streak Integrity Check

The database checks streak validity when initializing:
- **Condition**: A streak continues if the user logs any daily activity (completing a workout, a focus session, walking 10k steps, or completing a custom habit) today or yesterday.
- **Auto-Reset**: If the user didn't log any activity yesterday, Gymeo marks the streak broken and resets the counter to `0` when opening the app.

---

## 🎹 Ambient Sound Synthesizer

The sound machine in `FocusModeView.tsx` uses Web Audio API nodes.

### White Rain Noise Synth
It generates brownian noise by filtering random samples to simulate falling rain:
```javascript
const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
const output = noiseBuffer.getChannelData(0);
let lastOut = 0.0;
for (let i = 0; i < bufferSize; i++) {
  const white = Math.random() * 2 - 1;
  output[i] = (lastOut + (0.02 * white)) / 1.02;
  lastOut = output[i];
  output[i] *= 3.5; // Gain adjustment
}
```

### Binaural Hum Focus Wave
Plays two distinct low frequencies in each ear (160Hz and 164.5Hz) using stereo panners to induce a binaural wave of 4.5Hz:
```javascript
const osc1 = ctx.createOscillator();
const osc2 = ctx.createOscillator();
osc1.frequency.value = 160;
osc2.frequency.value = 164.5;
panner1.pan.value = -1; // Left ear
panner2.pan.value = 1;  // Right ear
```
