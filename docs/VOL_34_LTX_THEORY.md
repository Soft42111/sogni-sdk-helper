# 🎞️ Vol. 34: Temporal Transformer Theory: The LTX-2.3 Architecture

While the WAN family (Vols. 28-33) uses a hybrid approach to video, the **LTX-2.3** family on the Sogni Supernet is built on a **Pure Temporal Transformer** architecture. This volume explores why this makes LTX the leader in structural consistency and advanced keyframe control.

---

## 🏛️ The "World Model" Approach

LTX-2.3 is often referred to as a "World Model." Unlike models that paint frames one after another, LTX treats the entire video as a single, unified 4D block (Spatial + Temporal).

### Key Architectural Shifts:
1.  **Unified Encoding**: Every frame in the 4D block is aware of every other frame from the very first step of denoising. This eliminates the "Drift" often seen in older video models where the character's face changes as they walk.
2.  **Spatial-Temporal Patching**: The video is broken down into small 3D cubes of space-time. The Transformer then calculates the physics and motion of these cubes, ensuring that a person moving through the scene follows the consistent laws of motion.

---

## ⚡ The LTX Performance Profile

On the Sogni **Fast Network**, LTX-2.3 exhibits unique performance characteristics:
- **Quality**: Industry-leading structural adherence. "Solid" objects don't warp or melt.
- **Speed**: While the models are large (22B parameters), the Transformer architecture is highly parallelizable across Sogni's NVIDIA A100/H100 clusters.
- **Creativity**: Exceptional at complex camera movements like **Fpv Drones** or **Handheld Shaky-Cam** cinematic styles.

---

## 🎨 Why Use LTX Over WAN?

Choose LTX-2.3 when your project requires:
1.  **Strict Object Density**: You are animating a car, a building, or a product that cannot "wobble."
2.  **Specific Keyframing**: You have exactly two frames (Start and End) and need the AI to perfectly interpolate the middle.
3.  **High Resoution**: LTX-2.3 is highly optimized for **1216x688** and other wider cinematic aspect ratios.

---

## 🛠️ SDK Implementation Basics

All LTX models on Sogni are high-memory and require the `fast` network.

```javascript
const project = await sogni.projects.create({
  type: 'video',
  network: 'fast',
  modelId: 'ltx23-22b-fp8_t2v_dev', // The standard high-fidelity LTX model
  positivePrompt: 'A wide cinematic shot of a rainy street at night, neon reflections',
  duration: 5,
  fps: 24, // LTX supports true 24fps generation
});
```

---

**Next Volume**: [Vol. 35: LTX Frame Math](./VOL_35_LTX_FRAME_MATH.md)
