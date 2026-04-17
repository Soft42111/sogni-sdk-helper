# 🎵 Audio Composition Engine: ACE-Step 1.5

The Sogni Supernet extends its decentralized compute power to the realm of audio. Through the **ACE-Step 1.5** model family, you can generate complete musical compositions, including lyrics, instrumentation, and melodic structure, all via the SDK.

---

## 🎹 Model Selection

Two variations of ACE-Step 1.5 are available, each with a different focus.

| Model ID | Profile | Strength |
|----------|---------|----------|
| `ace_step_1.5_turbo` | **Turbo** | Extremely fast generation; best for upbeat, catchy instrumental or high-energy tracks. |
| `ace_step_1.5_sft` | **SFT (Finetuned)** | Superior lyrics adherence and vocal stability. Best for ballads, folk, or complex narratives. |

---

## 📝 The Anatomy of an Audio Project

Audio projects use the `type: 'audio'` and require specific musical metadata to guide the synthesis.

```javascript
const project = await sogni.projects.create({
  type: 'audio',
  modelId: 'ace_step_1.5_turbo',
  positivePrompt: 'A high-energy synthwave track with 80s drum machines and soaring leads',
  duration: 60,       // 10 to 600 seconds (10 minutes max)
  bpm: 120,           // 30 to 300 BPM
  keyscale: 'C# major',
  timesignature: '4', // 4/4 time
  steps: 8            // 4 to 16 range
});
```

---

## 🎤 Handling Lyrics & Vocals

To include singing, simply provide the `lyrics` parameter along with the `language` code.

### Guidelines for Lyrics
- **Structure**: Use tags like `[Verse 1]`, `[Chorus]`, and `[Bridge]` to help the AI understand the song's structure.
- **Language**: Sogni supports 50+ languages. Always specify the two-letter ISO code.

```javascript
{
  lyrics: `[Verse 1]\nNeon lights reflect the rain\nEchoes of a digital pain\n\n[Chorus]\nLost in the Supernet\nA rhythm we won't forget`,
  language: 'en'
}
```

---

## 🎼 Advanced Composition Controls

### `composerMode` (Boolean)
When enabled (default: `true`), the Supernet runs a secondary AI pass to optimize the composition's arrangement and mastering before delivery.

### `creativity` (Temperature)
- **Range**: 0.0 - 2.0 (Default: 0.85)
- **Effect**: Controls the "unpredictability" of the melody. 
  - `0.4`: Conservative, safe melodies.
  - `1.5`: Experimental, avant-garde progressions.

### `promptStrength`
- **Range**: 0.0 - 10.0 (Default: 2.0)
- **Effect**: How strictly the AI adheres to the `positivePrompt`. If your prompt is detailed, increase this to `3.5`.

---

## 📁 Output Formats

Sogni provides three choices for the final render:
- **`mp3`**: Best for web streaming and quick previews (Default).
- **`wav`**: Uncompressed, best for post-production or DAW integration.
- **`flac`**: Lossless compression.

---

## 🧪 Seeding & Variations

Because musical taste is subjective, it is recommended to use the **`numberOfMedia`** parameter to generate multiple "takes" of the same song simultaneously.

```javascript
const project = await sogni.projects.create({
  // ... parameters
  numberOfMedia: 3 // Generates 3 unique versions of the same prompt
});
```

---

## ⚠️ Known Constraints

1. **Vocal Limits**: Vocals are most stable in English (`en`), Chinese (`zh`), and Japanese (`ja`). 
2. **Complexity**: Very long tracks (5+ minutes) consume significant Spark tokens and take several minutes to render.
3. **Lyrics Length**: Ensure your lyrics fit within the requested `duration`. A 30-second track cannot accommodate a 10-verse poem.

---

**Next Step**: [07_LLM_INTELLIGENCE_API.md](./07_LLM_INTELLIGENCE_API.md)
