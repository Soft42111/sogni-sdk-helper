# 🎬 Video Temporal Dynamics: LTX-2.3 & LTX-2

While WAN is the master of high-motion interpolation, the **LTX** family (Diffusion Transformers) represents the standard for **actual temporal generation**. LTX models generate frames precisely at the FPS you request, providing a more "grounded" and deterministic result.

---

## ⚡ LTX Model Variants

The LTX family is the current "next-gen" standard on the Sogni Supernet, known for superior prompt adherence and realistic physics.

| Model Tier | ID Suffix | Steps | Use Case |
|------------|-----------|-------|----------|
| **Distilled** | `_distilled` | 8 | Rapid generation, high efficiency. |
| **Developer** | `_dev` | 20 - 50 | Maximum precision and stability. |

**Top Models**:
- `ltx23-22b-fp8_t2v_dev` (22 Billion parameters, Text-to-Video)
- `ltx23-22b-fp8_i2v_distilled` (Image-to-Video)

---

## 🕒 The FPS & Frame Logic (Mathematical Rigor)

Unlike WAN, LTX models do **not** use post-render interpolation.

### Actual FPS
If you set `fps: 24`, the model literally computes 24 unique frames for every second of video. There are no "fake" frames created after the fact.

### The Frame Pattern Constraint
The LTX architecture requires a specific number of frames to satisfy its internal latent block sizing. The frame count must always follow the sequence:
**`Frames = (n * 8) + 1`**

Valid frame counts include:
- `1` (Static)
- `9`
- `17`
- `81` (The "Sweet Spot" - ~3.3s at 24fps)
- `121` (~5s at 24fps)

> [!NOTE]
> The Sogni SDK will automatically "snap" your requested duration/fps to the nearest valid frame count in this sequence to ensure the worker does not reject the job.

---

## 🔄 Image-to-Video (i2v) Workflows

LTX models Excel at animating images while maintaining perfect fidelity to the source.

### Keyframe Control
LTX-2.3 supports both a **First Frame** and a **Last Frame**, allowing for perfect loop generation or specific scene transitions.

```javascript
{
  type: 'video',
  modelId: 'ltx23-22b-fp8_i2v_dev',
  referenceImage: startBuffer,    // Frame 0
  referenceImageEnd: endBuffer,   // Frame N
  firstFrameStrength: 0.6,        // Adherence to start image
  lastFrameStrength: 0.6,         // Adherence to end image
  duration: 5,
  fps: 24
}
```

### Strength Calibration
- **Higher Strength (0.9)**: The AI tries to change almost nothing, resulting in subtle ambient movement (wind, breathing).
- **Lower Strength (0.4)**: The AI is given creative freedom to morph the subject between the two states.

---

## 🕹️ Video-to-Video & ControlNet (LTX-2 only)

LTX-2 (the predecessor to 2.3) includes powerful **Video ControlNet** support, which is currently the only way to perform motion-locked style transfers.

| Model ID | ControlNet Mode | Description |
|----------|-----------------|-------------|
| `ltx2-19b-fp8_v2v_distilled`| `canny` | Locks the video to the edges of the source. |
| | `depth` | Locks the video to the 3D depth of the source. |
| | `pose` | Locks the video to a skeletal pose map. |

### V2V Implementation
```javascript
{
  type: 'video',
  modelId: 'ltx2-19b-fp8_v2v_distilled',
  referenceVideo: sourceVideoBuffer,
  controlNet: {
    name: 'depth',
    strength: 0.65
  }
}
```

---

## 📏 Resolving Dimensions

LTX models are sensitive to resolution ratios. It is highly recommended to use the standard **Video Presets** rather than custom dimensions:
- `landscape_720p` (1280x720)
- `landscape_standard` (1024x576)
- `square_standard` (768x768)

---

**Next Step**: [06_AUDIO_COMPOSITION_ENGINE.md](./06_AUDIO_COMPOSITION_ENGINE.md)
