# 🧬 Vol. 38: Video ControlNet: Temporal Consistency Logic

While Image ControlNet (Vols. 22-25) provides spatial structure, **Video ControlNet** (specifically optimized for the LTX-2.3 architecture) provides **Temporal Structure**. This volume explains how to use Video ControlNet to "Rig" a cinematic sequence with absolute physical consistency.

---

## 🏛️ The Temporal Rigging Engine

Video ControlNet works by injecting a stream of control maps (one for every frame) into the LTX transformer.
- **The Input**: Instead of a single image, you provide a **Control Video** (e.g., a video of a stick-figure dancing).
- **The Output**: The AI generates a high-fidelity character whose motion is 100% locked to the skeletal movements of that stick figure.

---

## 🛠️ Supported Video Control Channels

On the Sogni Supernet, Video ControlNet is primarily used with two channels:

### 1. Video-Canny (Edge Logic)
Maintains the outlines of a source video while restyling the subjects.
- **Use Case**: Change the car in a chase sequence into a futuristic pod without altering the high-speed motion or camera angles.

### 2. Video-Depth (Spatial Logic)
Maintains the 3D volume and spatial movement of a scene.
- **Use Case**: Turn a video of a person walking through a park into a knight walking through a battlefield, ensuring that the ground-plant and foot-placement remain identical.

---

## 📐 SDK Implementation & Constraints

Video ControlNet requires a `video` source for the control map and a specialized model configuration.

```javascript
const project = await sogni.projects.create({
  type: 'video',
  network: 'fast',
  modelId: 'ltx23-22b-fp8_v2v', // Specialized Video-to-Video model
  video: originalSourceVideo,
  controlNet: {
    name: 'depth',
    strength: 0.8,
    mode: 'balanced'
  },
  positivePrompt: 'A stylized watercolor animation of a peaceful village',
  duration: 5,
  fps: 16
});
```

---

## 🧪 Solving "Temporal Flicker"

The most common issue in AI video is "Flicker"—where details like clothing patterns or hair color shift slightly between frames. Video ControlNet is the most effective solution for this problem.
- By providing a **Depth Map** for every frame, the AI "understands" that the object at (X, Y) in Frame 10 is the *same* object that was at (X-5, Y) in Frame 9. 
- This spatial anchoring prevents the AI from "re-inventing" the textures for every frame, leading to rock-solid temporal consistency.

---

## ⚠️ Performance Warning

Video ControlNet is the most computationally intensive operation on the Sogni Supernet.
- **VRAM Usage**: Requires double the VRAM of standard LTX generation.
- **Worker Availability**: These jobs are exclusively routed to **NVIDIA H100 or A100** clusters. Ensure your `network` is set to `fast` and be prepared for slightly longer queue times during peak demand.

---

**Next Division: Division VIII: Audio Composition**
[Vol. 39: ACE-Step 1.5 Theory](./VOL_39_ACE_STEP.md)
