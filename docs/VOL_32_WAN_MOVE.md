# 🧪 Vol. 32: WAN: Animate-Move (Motion Transfer)

**Animate-Move** is a specialized high-end workflow on the Sogni Supernet that allows you to "Extract" the motion from one video and "Apply" it to a static image. This is a breakthrough in cinematic control, allowing for consistent action without the unpredictability of pure text-to-video.

---

## 🏛️ The Motion Manifold Transfer

Animate-Move works by decoupling **Appearance** from **Motion**.
- **The Source Video**: Acts as a "Motion Template." The model analyzes the Optical Flow and temporal changes (e.g., a person walking, a camera panning).
- **The Source Image**: Acts as the "Appearance Template." It provides the textures, lighting, and subjects.
- **The Blend**: The Sogni Orchestrator merges these two manifolds, forcing the static image to follow the 3D velocity and movement patterns of the video.

---

## 🛠️ SDK Implementation

Animate-Move requires both an `image` (the target) and a `video` (the motion source).

```javascript
const project = await sogni.projects.create({
  type: 'video',
  network: 'fast',
  modelId: 'wan_v2.2-14b-fp8_animate_move', // Specialized motion transfer model
  image: characterPortraitBuffer,
  video: motionReferenceVideoBuffer, // The video whose motion you want to steal
  positivePrompt: 'The character follows the movement of the reference video',
  duration: 5,
  fps: 16
});
```

---

## 📐 Precision & Structural Adherence

### 1. The "Ghosting" Problem
If the motion in the reference video is too extreme or different from the shape of the target image (e.g., moving a car's motion onto a person), the AI may "smear" or create "ghosting" artifacts as it tries to reconcile the two shapes.

### 2. Semantic Alignment
Animate-Move works best when the **Subject Category** matches between the two sources:
- **Case A (High Success)**: Human motion video -> Human character image.
- **Case B (Moderate Success)**: Fluid/Water motion video -> Flame/Fire image.
- **Case C (Low Success)**: Bird flying video -> Stationary building image.

---

## 🧪 Advanced Tuning: Motion Strength

While the current SDK version primarily relies on the model's auto-detection, you can influence the result via your prompt:
- **High Adherence**: "Meticulously follow the motion path, high structural fidelity."
- **Creative Blend**: "Use the video for inspiration but allow for fluid reimagining of the scene."

---

## 🎨 Use Cases for Animate-Move

1.  **Professional Rotoscoping**: Take a video of an actor in a living room and "transfer" their performance to a high-fidelity AI-generated alien on a foreign planet.
2.  **Product Cinematography**: Use a stock video of a rotating object to make your AI-generated product design rotate with the same professional lighting and speed.
3.  **Experimental Art**: Transfer the motion of waves or clouds onto an urban landscape, creating surreal "melting city" aesthetics.

---

**Next Volume**: [Vol. 33: WAN: Animate-Replace](./VOL_33_WAN_REPLACE.md)
