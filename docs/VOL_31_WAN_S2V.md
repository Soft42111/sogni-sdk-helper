# 🔊 Vol. 31: WAN: Sound-to-Video (Lip Sync Theory)

Sound-to-Video (s2v) is the most advanced branch of the WAN 2.2 family on the Sogni Supernet. It allows the SDK to drive the animation of a human subject based on an external audio file, creating highly realistic lip-sync and facial expressions.

---

## 🏛️ The Audio-Visual Manifold

In `s2v`, the worker node utilizes a specialized **Audio Encoder** (typically based on Wav2Vec2 or similar architectures) to extract "Visemes" (the visual representation of phonemes) from the audio stream.

### How it works:
1.  **Phoneme Extraction**: The model listens to the audio and identifies the specific sounds (e.g., "Ah", "Oh", "Mmm").
2.  **Viseme Mapping**: These sounds are mapped to the mouth and jaw positions of the target face.
3.  **Temporal Blending**: The model ensures that the lip movement is not just "opening and closing," but follows the fluid natural motion of speech, including tongue positions and cheek movements.

---

## 🛠️ SDK Implementation

To use s2v, you must provide a `modelId` (specifically for s2v workflows) and an `audio` source.

```javascript
const project = await sogni.projects.create({
  type: 'video',
  network: 'fast',
  modelId: 'wan_v2.2-2b-fp8_s2v', // Specialized s2v model
  image: characterPortraitBuffer,
  audio: speechAudioBuffer,       // The voice driving the video
  positivePrompt: 'A high-fidelity portrait of a corporate executive speaking',
  duration: 10, // Match or exceed audio duration
  fps: 16
});
```

---

## 📐 Audio-Video Synchronization

### 1. The Clock Match
The **Duration** of your project should ideally match the duration of your audio clip. 
- If the project is too short, the audio will be truncated. 
- If the project is too long, the character will stop speaking but might continue to blink or shift slightly in an "idle" animation state.

### 2. The 16fps Precision
Because WAN 2.2 is natively 16fps (Vol. 28), the lip-sync is most accurate when the original 16fps frames are used. Post-render interpolation to 30fps or 60fps can sometimes cause the lips to look slightly "mushy" during fast speech.

---

## 🎨 Beyond Speech: Expressive Audio

The Sogni `s2v` model is not limited to simple talking. It can react to:
- **Laughter**: The model will widen the mouth and squint the eyes.
- **Sighs**: The model will drop the jaw and relax the facial muscles.
- **Singing**: High-intensity audio peaks will trigger more dramatic mouth openings and head tilts.

---

## ⚠️ Summary of Best Practices

- **High-Quality Audio**: Use clean, noise-free audio (44.1kHz or 48kHz). Background noise or music can "confuse" the viseme detector, leading to "glitchy" mouth movements.
- **Clear Portrait**: The source image must have a clear, front-facing or 3/4 view of the face. Side profiles are significantly harder for the model to animate accurately.
- **Lighting Consistency**: Ensure the character's face is well-lit. Shadows across the mouth can interfere with the model's perception of the lip boundaries.

---

**Next Volume**: [Vol. 32: WAN: Animate-Move](./VOL_32_WAN_MOVE.md)
