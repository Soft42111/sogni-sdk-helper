# 🧬 Vol. 33: WAN: Animate-Replace (In-Context Animation)

**Animate-Replace** is the most semantically intelligent model in the Sogni video suite. It allows you to transform the subject of an existing video while maintaining the exact background, lighting, and camera movement. This is "Deepfake" technology elevated to an industrial-grade creative tool.

---

## 🏛️ Contextual Inpainting in Motion

Unlike `Animate-Move` (Vol. 32), which applies motion to a static image, **Animate-Replace** performs a frame-by-frame transformation.
- **The Process**: The model "sees" the original video, identifies the primary subject, and "repaints" that subject based on your new prompt or image reference. 
- **The Stability**: Because it uses the original video as a structural anchor, the background remains 100% stable, and the lighting on the new subject is automatically calculated to match the original environment.

---

## 🛠️ SDK Implementation

Animate-Replace requires a `video` source and either a `positivePrompt` or a reference `image`.

```javascript
const project = await sogni.projects.create({
  type: 'video',
  network: 'fast',
  modelId: 'wan_v2.2-14b-fp8_animate_replace', // Specialized replacement model
  video: originalSceneVideoBuffer,
  positivePrompt: 'A glowing cyan robotic knight with neon highlights',
  duration: 5,
  fps: 16
});
```

---

## 📐 The "Semantic Swap" Logic

### 1. Subject Preservation
The model is designed to follow the **Silhouette** of the original actor or object. 
- If the original actor raises their left hand, the new "Robotic Knight" will also raise its left hand at the exact same frame.
- **Limitation**: It cannot change the fundamental physics. If the person in the video is sitting, the replacement cannot be dancing.

### 2. Lighting & Shadow Integration
One of the "Magic" features of Animate-Replace is the **Environment Mapping**. If the original video has a red light hitting the actor's face, the new replaced subject will also have a red light correctly calculated across its 3D surfaces.

---

## 🧪 Advanced Strategies: The Image-Reference Swap

For the highest possible quality, you can provide a reference `image` alongside the `video`.
1.  **Step 1**: Generate a character you love using **Flux** (Vol. 18).
2.  **Step 2**: Use a video of yourself walking as the `video` source.
3.  **Step 3**: Call `Animate-Replace` with the Flux character as the `image` reference.
4.  **Result**: Your "Flux" character is now walking in your real-world environment with perfect consistency.

---

## 🎨 Creative Use Cases

1.  **Virtual Influencers**: Replace yourself in high-end fashion videos with your virtual avatar.
2.  **Concept Commercials**: Swap a generic car in a driving sequence for a futuristic prototype.
3.  **Cine-Dressing**: Keep a cinematic performance, but change the actor's outfit or accessories (e.g., changing a jacket into a suit of armor).

---

**Next Volume**: [Vol. 34: Temporal Transformer Theory](./VOL_34_LTX_THEORY.md)
