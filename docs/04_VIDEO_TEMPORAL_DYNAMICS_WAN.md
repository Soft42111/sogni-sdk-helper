# 🎬 Video Temporal Dynamics: WAN 2.2 Deep Dive

The **WAN 2.2** model family is the current frontier for high-motion, high-fidelity video generation on the Sogni Supernet. Mastering WAN requires understanding its unique internal architecture and its specialized workflows.

---

## ⚡ WAN 2.2 Model Variants

WAN 2.2 is offered in two primary tiers, optimized for either rapid feedback or cinematic production.

| Model Suffix | Tier | Steps | Notes |
|--------------|------|-------|-------|
| `_lightx2v` | **Speed** | 4 - 8 | Fast inference, consistent motion. |
| (no suffix) | **Quality** | 20 - 50 | Maximum detail, best for cinematic finals. |

**Example Model IDs**:
- `wan_v2.2-14b-fp8_t2v_lightx2v`
- `wan_v2.2-14b-fp8_i2v`

---

## 🕒 The FPS Paradox (Critical Detail)

**Important**: WAN 2.2 has a non-standard relationship with the `fps` parameter.

- **Internal Generation**: The WAN 2.2 model *always* generates video at **16 FPS** internally.
- **Interpolation Engine**: The `fps` parameter you provide (e.g., `16` or `32`) controls the **post-render interpolation**.
  - `fps: 16`: No interpolation. The frames match the model's output.
  - `fps: 32`: The Supernet uses a secondary AI model to double the frame count after the initial generation, creating smoother motion.

### The Frame Equation
The number of frames generated is calculated as:
**`Frames = (Duration * 16) + 1`**
(The `fps` setting does *not* affect this internal calculation).

---

## 🌊 Workflows: Beyond Text-to-Video

WAN 2.2 enables five sophisticated workflows that allow for complex cinematic control.

### 1. Text-to-Video (t2v)
The standard generative path.
```javascript
{
  type: 'video',
  modelId: 'wan_v2.2-14b-fp8_t2v_lightx2v',
  positivePrompt: 'A roaring ocean wave in slow motion, 4k cinematic',
  duration: 5, // 5 seconds
  fps: 32      // Smoothed to 32fps
}
```

### 2. Image-to-Video (i2v)
Animates a static starting point.
- **`referenceImage`**: REQUIRED.
- **Tip**: High-contrast images with clear focal points yield the most dramatic motion.

### 3. Sound-to-Video (s2v)
Synchronizes visual motion to an audio track.
- **`referenceImage`**: The subject's face/body.
- **`referenceAudio`**: The guide track.
- **Use Case**: Expert-level lip syncing and reactive character animation.

### 4. Animate-Move
Motion transfer from a reference source.
- **`referenceImage`**: The new subject.
- **`referenceVideo`**: The motion source.
- **Mechanism**: Extracts the motion envelope from the video and applies it to the static subject.

### 5. Animate-Replace
Subject replacement while preserving the background and movement.
- **Use Case**: Swapping a character in a complex scene while keeping the camera path identical.

---

## 🛠️ Advanced Hyperparameters

### `shift` (Motion Intensity)
- **Range**: 1.0 - 8.0 (Default: ~5.0)
- **Effect**: Controls the "fluidity" of the latent space. Higher values create more explosive, rapid movement but can lead to structural warping.

### `teacacheThreshold` (Optimization)
- **Range**: 0.0 - 1.0 (Default: 0.0)
- **Effect**: Skips redundant computations in similar frames. 
- **Setting to `0.3` can speed up generation by 30%** with almost zero perceptual loss of quality.

---

## 🎨 Best Practices for WAN 2.2

1. **Divisibility by 16**: Ensure your `width` and `height` are divisible by 16. (e.g., 512, 768, 1024).
2. **Start Small**: Use `lightx2v` for prompting iterations. Once the composition is perfect, switch to the full Quality model for the final export.
3. **Negative Prompting**: Unlike image models, WAN requires very specific negative prompts to maintain temporal consistency (e.g., `shaking, flickering, morphing`).

---

**Next Step**: [05_VIDEO_TEMPORAL_DYNAMICS_LTX.md](./05_VIDEO_TEMPORAL_DYNAMICS_LTX.md)
