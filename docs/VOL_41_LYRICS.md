# 🎤 Vol. 41: Lyrical Vocal Stability: SFT Models

One of the "Magic" tiers of Sogni's ACE-Step 1.5 engine is the inclusion of **Lyrical Intelligence**. This volume explores how to integrate text lyrics into your audio projects and how SFT (Supervised Fine-Tuning) models ensure vocal stability.

---

## 🏛️ The Lyrics Manifold

In a lyrical audio project, the SDK accepts a separate `lyrics` parameter.
- **The Decoder**: The model doesn't just "see" the words; it understands the syllable structure, the rhyme scheme, and the expected cadence based on the chosen musical style.
- **The SFT Layer**: Sogni's audio workers are fine-tuned on thousands of hours of vocal/instrumental stems. This allows the model to "separate" the voice from the music while maintaining a perfect pitch relationship between them.

---

## 🛠️ SDK Implementation

To enable vocals, you must provide the `lyrics` string.

```javascript
const project = await sogni.projects.create({
  type: 'audio',
  modelId: 'ace_step_1.5_hq',
  positivePrompt: 'A powerful female vocal pop song, upbeat, 80s style',
  lyrics: `[Verse 1]
           In the circuits of the night
           We are searching for the light
           Sogni dreams in every byte
           Everything will be alright`,
  bpm: 124,
  duration: 30
});
```

---

## 📐 Mastering the Cadence

The way you format your lyrics significantly impacts the vocal performance.

### 1. Structure Tags (`[Verse]`, `[Chorus]`, `[Bridge]`)
Use square brackets to signal the model to change its "Dynamic Energy."
- **`[Chorus]`**: Usually triggers a fuller, more powerful vocal and layered backing tracks.
- **`[Whisper]`**: Can be used to trigger low-intensity, intimate vocal deliveries.

### 2. Line Breaks & Punctuation
The AI treats line breaks as "Breathing Points."
- If you have a long sentence with no breaks, the AI may "run out of breath" or sing too fast.
- Use line breaks and commas to create natural rhythmic pauses.

---

## 🧪 Vocal Identity & Consistency

A common challenge is maintaining the **same voice** throughout multiple tracks.
- **The Seed strategy**: Using the same `seed` for different lyrics blocks often preserves the "Vocal timbre" and "Identity" of the singer.
- **Prompt Anchoring**: Always include specific descriptors like "Raspiness," "High-pitched," or "Soulful" to give the SFT layers a target to lock onto across different projects.

---

## 🎨 Creative Capabilities

Beyond standard singing, Sogni's ACE-Step 1.5 can handle:
- **Spoken Word**: Prompt for "Poetry reading" or "Podcast intro."
- **Harmonies**: The model automatically layers backing vocals during choruses if the prompt mentions "Rich harmonies."
- **Ad-libbing**: Providing `(...)` or `[Ad-lib]` in your lyrics can trigger the AI to add vocal "flair" (oohs, aahs) between lines.

---

**Next Volume**: [Vol. 42: Multi-Take Seeding](./VOL_42_AUDIO_VARIATIONS.md)
