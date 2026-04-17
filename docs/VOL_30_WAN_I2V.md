# 🖼️ Vol. 30: WAN: Image-to-Video (i2v) Dynamics

Image-to-Video (i2v) is the bridge between static masterpiece and cinematic reality. This volume explores how the Sogni SDK transforms a single reference frame into a temporal sequence while maintaining absolute character and environment fidelity.

---

## 🏛️ The "Anchor Frame" Logic

In `i2v`, your source image acts as the **Frame 0** (the Anchor). 
- **The Challenge**: The model must invent what happens in the *next* 80 frames (at 16fps) without losing the specific hair color, lighting, or background of the original.
- **The Solution**: The WAN `i2v` model utilizes a specialized **Vision Encoder** that "injects" the source image's feature map into every temporal block of the generation process.

---

## 🛠️ SDK Implementation

To use i2v, you must provide a `modelId` designed for image-to-video (specifically the `lightx2v` variants) and a source `image`.

```javascript
const project = await sogni.projects.create({
  type: 'video',
  network: 'fast',
  modelId: 'wan_v2.2-14b-fp8_t2v_lightx2v', // The lightx2v suffix indicates i2v capability
  image: sourceImageBuffer,
  positivePrompt: 'The woman slowly turns her head and smiles at the camera',
  duration: 5,
  fps: 16
});
```

---

## 📐 Motion Strengths & Vectors

Unlike `t2v`, where the AI has total freedom, `i2v` requires a balance between "Sticking to the photo" and "Moving the subject."

### 1. Prompting for Transformation
Your prompt should describe the **change** from the static image.
- **Wait**: Don't say "A woman sitting."
- **Act**: Say "A woman *begins to stand up*."
- **Flow**: The AI assumes the static state from the photo; the prompt provides the **Kinetic Energy**.

### 2. High-Fidelity Preservation
WAN 2.2 is exceptionally good at preserving clothing textures and jewelry. However, if the motion requested is too extreme (e.g., "The woman does a backflip"), the model may experience "Latent Stress," where the background begins to warp or the character's face changes.

---

## 🧪 Advanced "First-Frame-Consistency" (FFC)

For industrial-grade results, use the following techniques:
- **Seed Matching**: If you generated the original image using a Sogni model (e.g., Flux), try using the **same seed** for the `i2v` project. This helps align the initial noise manifold with the latent patterns of the source image.
- **Negative Prompting**: Use "shaking," "morphing," and "background warp" to keep the environment stable while the subject moves.

---

## 🎨 Use Cases for i2v

1.  **AI Branding**: Take a static photo of a product and make it rotate or shimmer.
2.  **Cinematic Portraits**: Bring a high-end AI portrait to life with subtle "parallactic" motion (hair blowing in wind, blinking eyes).
3.  **Holographic Interfaces**: Take a 2D interface design and animate the "glow" and "data streams" across the surface.

---

**Next Volume**: [Vol. 31: WAN: Sound-to-Video](./VOL_31_WAN_S2V.md)
