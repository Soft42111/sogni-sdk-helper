# 🎹 Vol. 40: Musical Metadata Logic: BPM & Scale

The Sogni SDK provides programmatic control over the "Musical Theory" foundations of your audio generation. This volume explores how to use metadata to ensure that generated tracks fit perfectly within your project's technical constraints.

---

## 🏛️ The Metadata Injection Layer

In `ace_step` projects, the model isn't just listening to your prompt; it's also looking at a set of **Musical Anchors**. By defining these anchors, you prevent the AI from "wandering" off-beat or out-of-key.

---

## 🥁 BPM (Beats Per Minute)

The `bpm` parameter regulates the temporal grid of the audio.
- **Why it matters**: If you are creating a video and want the visuals to "cut" on the beat, you must ensure the audio has a fixed, known BPM.
- **Range**: Sogni supports a range of **40 to 220 BPM**.

```javascript
const project = await sogni.projects.create({
  type: 'audio',
  modelId: 'ace_step_1.5_hq',
  positivePrompt: 'A driving techno track with industrial percussion',
  bpm: 128 // Locks the tempo for seamless video editing
});
```

---

## 🎵 Key & Scale

To ensure the generated audio is harmonious (especially when layering multiple tracks or sound effects), you can lock the **Key** and **Scale**.

### 1. The Key (The Root Note)
Supports all standard chromatic root notes: `C`, `C#`, `D`, `Eb`, `E`, `F`, `F#`, `G`, `Ab`, `A`, `Bb`, `B`.

### 2. The Scale (The Mood)
The scale determines the harmonic intervals available to the model.
- **`major`**: Bright, happy, triumphant.
- **`minor`**: Sad, epic, serious.
- **Specialized**: `dorian`, `phrygian`, `lydian` (Ideal for fantasy or sci-fi ambient tracks).

```javascript
{
  key: 'Eb',
  scale: 'minor' // Perfect for an "Epic Orchestral" trailer vibe
}
```

---

## 📐 Time Signature

While the default is **4/4**, ACE-Step 1.5 allows for complex rhythmic structures.
- **`3/4`**: Waltz-like, graceful motion.
- **`5/4` or `7/8`**: Experimental, "Math Rock" or cinematic suspense.

---

## 🧪 Advanced Iteration: Seed Continuity

If you find a musical theme you love but the BPM is slightly off, you can re-run the project with the **Same Seed** but a **New BPM**.
- Because the seed defines the latent "harmonic manifold," much of the instrumentation and melody will remain similar, but the temporal distribution will be "stretched" or "squeezed" to fit the new tempo.

---

## ⚠️ Summary of Best Practices

- **Avoid Metadata Conflicts**: If you prompt for "A fast heavy metal track" but set the `bpm` to `60`, the AI will struggle to reconcile the two, often resulting in a "sludge" aesthetic or messy transients.
- **Sync with Video**: For high-end cinematic projects, always calculate your `bpm` relative to your video `fps`. (e.g., at 120bpm, there is 1 beat every 0.5 seconds).

---

**Next Volume**: [Vol. 41: Lyrical Vocal Stability](./VOL_41_LYRICS.md)
