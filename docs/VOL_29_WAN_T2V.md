# 📝 Vol. 29: WAN: Text-to-Video (t2v) Deep Dive

Text-to-Video (t2v) is the primary entry point for cinematic creation on the Sogni Supernet. This volume explores the specific technical strategies for prompting temporal consistency and cinematic quality using the WAN 2.2 model family.

---

## 🏛️ The Temporal Attention Mechanism

WAN 2.2 utilizes a specialized **3D Attention** mechanism. Unlike 2D models that only look at spatial relationships (pixels in one frame), WAN looks at "temporal tubes."
- **How it works**: The model calculates the spatial relationship (where objects are) and the temporal relationship (how they move) simultaneously.
- **The Result**: Physics-defying consistency where subjects maintain their identity across multi-second spans.

---

## 🛠️ Prompting for Motion

In t2v, your prompt is the only source of truth for both the **subject** and the **action**.

### 1. Separate "Scene" from "Motion"
For the best results, structure your prompt with clear motion descriptors.

| Scene Description | Motion Descriptor | Result |
|-------------------|-------------------|--------|
| "A cyberpunk city"| "Slow cinematic drone sweep" | Fluid, professional camera movement. |
| "A roaring lion" | "Slow motion roar, saliva spray"| High-intensity particle physics. |
| "Digital rain" | "Falling vertically, 4k" | Consistent downward velocity. |

### 2. Avoiding "Temporal Morphing"
If a prompt is too generic (e.g., "A man walking"), the AI might "morph" the man into a different person halfway through. 
- **The Fix**: Be hyper-specific about the subject's appearance. Use "A man with a red tie and silver hair walking" to give the temporal layers more anchors to latch onto.

---

## ⚙️ Key Scaling Parameters

### Negative Prompting
In video, the negative prompt is critical for removing temporal artifacts.
```javascript
negativePrompt: "low resolution, shaky camera, flickering, temporal artifacts, morphing, static image"
```

### Seed Selection
In t2v, the seed determines the **initial noise manifold**.
- If a video has a great layout but "nervous" motion, try the exact same prompt with a different seed to find a more stable temporal manifold.

---

## 📐 Resolution & Aspect Ratios

WAN 2.2 supports multiple cinematic aspect ratios.

- **16:9 Landscape (`1280x720`)**: The standard for film and cinematic trailers.
- **9:16 Portrait (`720x1280`)**: Optimized for social media and mobile-first experiences.

**Warning**: Avoid using non-standard resolutions (e.g., 500x500) as the underlying temporal attention blocks are hard-coded for multiples of 64 or 128.

---

## 🧪 Advanced Iteration Workflow

1.  **Draft Pass**: Run a 5-second `t2v` project at 16fps.
2.  **Selection**: Identify the best seed and composition.
3.  **Refinement**: Use the resulting video as a reference for `Animate-Replace` (Vol. 33) or extend it using future temporal stitching techniques.

---

**Next Volume**: [Vol. 30: WAN: Image-to-Video](./VOL_30_WAN_I2V.md)
