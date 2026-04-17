# 🖼️ Vol. 36: Keyframe Adherence: First & Last Frame Strength

The LTX-2.3 architecture provides the most robust **Keyframe Control** available in the Sogni SDK. This volume explores how to use Image-to-Video and Video-to-Video workflows to anchor the beginning and the end of your cinematic sequence.

---

## 🏛️ The Bi-Directional Anchor

Unlike most models that can only "expand" from a starting frame, LTX-2.3 is designed to "Interpolate" between a starting and ending state.

### 1. Simple Image-to-Video (Start Frame)
The standard use case. You provide an image, and LTX generates the motion *forward* from that point.

### 2. Multi-Keyframe Video (Start + End Frame)
In the Sogni SDK, you can provide an array of images or a specialized `keyframe` object to anchor both the first and last frames of the video.
- **Why?**: This is the "Holy Grail" of animation. It allows you to define exactly where a person starts and exactly where they finish, letting the AI calculate the most efficient and aesthetic path of motion between the two points.

---

## 🛠️ Tuning Adherence Strength

LTX-2.3 allows you to define how strictly the AI follows your anchor frames via the **`keyframe_strength`** (or `image_strength`) parameter.

- **High Strength (0.9 - 1.0)**: Use when you have a specific character that must match the source exactly. 
- **Low Strength (0.5 - 0.7)**: Allows the AI to "Iterate" on the subject. For example, it might change the lighting or expression of the character in the first frame to better match the flow of the rest of the cinematic.

---

## 📐 The "Temporal Pull" Effect

In LTX, the attention mechanism creates a "Temporal Pull."
- If the **Last Frame** is very different from the **First Frame**, the AI will accelerate the motion in the middle frames to ensure it arrives at the destination on time.
- **Over-Stretching**: If the two frames are *too* different (e.g., a car in the first frame and a bird in the last), the model will attempt to morph them, which can lead to unrealistic temporal artifacts.

---

## 🧪 Advanced Stitching Workflows

Using keyframes, you can join multiple videos into a single cohesive narrative.
1.  **Project A**: Generate a 5-second video.
2.  **Extraction**: Take the last frame of Project A.
3.  **Project B**: Use that last frame as the **First Frame** (Keyframe) for a new LTX project.
4.  **Result**: A perfectly seamless 10-second cinematic sequence with zero "jump-cuts."

---

## ⚠️ Summary of Best Practices

- **Resolution Consistency**: Ensure your keyframe images match the `resolution` parameter of your video project exactly.
- **Lighting Continuity**: If your start and end frames have wildly different lighting (e.g., Day to Night), the AI will generate a "Fast Forward" time-lapse effect to bridge them. 

---

**Next Volume**: [Vol. 37: LTX-2.3 Dev vs Distilled](./VOL_37_LTX_VARIANTS.md)
