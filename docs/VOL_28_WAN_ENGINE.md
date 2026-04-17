# 🎬 Vol. 28: WAN 2.2: The 16fps Internal Manifold

The **WAN 2.2** model family is the powerhouse of video generation on the Sogni Supernet. Understanding its internal temporal constraints is the key to producing smooth, high-fidelity cinematic content.

---

## 🏛️ The Fixed 16fps Architecture

Unlike some video models that can generate at arbitrary framerates, WAN 2.2 is mathematically optimized for exactly **16 frames per second** (fps) at the latent level.

### Why 16fps?
- **Stability**: This framerate provides the perfect balance between temporal coherence (fluid motion) and computational efficiency.
- **Latency Consistency**: By fixing the framerate, the Sogni Supernet can provide deterministic ETAs for video projects.

---

## 🎞️ The "Generated" vs. "Interpolated" Logic

When you send a request to the Sogni SDK with a `duration` and `fps` parameter, the worker performs a two-stage process:

1.  **Stage 1: Base Generation (16fps)**
    The model generates the raw video frames at a native 16fps. For a 5-second video, this results in 80 distinct "Base Frames."

2.  **Stage 2: Post-Render Interpolation**
    The worker utilizes a specialized temporal interpolation engine to match your requested `fps`.
    - If you request **`fps: 16`**: No interpolation occurs. You receive the raw, cinematic output of the model.
    - If you request **`fps: 30` or `fps: 60`**: The engine creates "Intermediate Frames" to smooth out the motion.

---

## 🛠️ SDK Implementation

In the Sogni SDK, all WAN models require the `network: 'fast'` parameter due to their massive VRAM requirements.

```javascript
const project = await sogni.projects.create({
  type: 'video',
  network: 'fast',
  modelId: 'wan_v2.2-14b-fp8_t2v_lightx2v',
  positivePrompt: 'A cinematic wide shot of a futuristic Tokyo with flying cars',
  duration: 5, // Total seconds
  fps: 16,     // Native framerate (Highly recommended)
  resolution: '1280x720'
});
```

---

## 📐 Optimal Duration Math

To keep your video projects efficient, it is recommended to work in increments that align with the 16fps internal clock.

| Seconds | Total Base Frames |
|---------|-------------------|
| 5s | 80 Frames |
| 10s | 160 Frames |
| 20s | 320 Frames (Advanced) |

---

## ⚠️ Summary of Best Practices

- **Stick to 16fps**: For the most "Cinematic" look, avoid interpolation by keeping `fps: 16`. High-fps interpolation can sometimes introduce "ghosting" artifacts in fast-moving scenes.
- **Resolution Control**: WAN 2.2 is optimized for 720p and 1080p. Avoid non-standard aspect ratios that aren't multiples of 64, as they can cause tiling errors in the temporal attention layers.

---

**Next Volume**: [Vol. 29: WAN: Text-to-Video](./VOL_29_WAN_T2V.md)
