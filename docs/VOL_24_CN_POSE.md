# 🕺 Vol. 24: ControlNet: OpenPose & Humanoid Constraints

Generating specific, non-generic human poses is one of the greatest challenges in AI art. **OpenPose ControlNet** solves this by allowing the Sogni SDK to lock the generated subject into a specific skeletal structure. 

---

## 🎨 How OpenPose Logic Works

The **OpenPose** algorithm detects human bodies in a source image and extracts a "Skeleton Map":
- **Keypoints**: Individual dots representing joints (elbows, knees, wrists, nose, eyes).
- **Segments**: Lines connecting the keypoints to form a human-like wireframe.
- **Face/Hand Extensions**: Specialized detectors for facial expression (68-points) and finger articulation (21-points per hand).

### Why use OpenPose?
Unlike Canny or Depth, OpenPose is **Content-Agnostic**. It doesn't care about the background or the clothes of the source; it only cares about the *pose*. You can take a photo of a person in a parka and generate a person in a spacesuit in the *exact same dynamic pose*.

---

## 🛠️ SDK Implementation

Implementation uses the `pose` name within the `controlNet` parameter.

```javascript
const project = await sogni.projects.create({
  type: 'image',
  modelId: 'coreml-cyberrealistic_v70_768',
  positivePrompt: 'A heroic warrior standing on a cliff, cinematic lighting, 8k',
  controlNet: {
    name: 'pose',
    image: dancingReferenceBuffer, // Pose taken from a dancer reference
    strength: 1.0,
    mode: 'balanced'
  }
});
```

---

## 🧪 Advanced Posing Strategies

### 1. Multi-Subject Coordination
If you have a reference image of two people shaking hands, OpenPose detects both skeletons and ensures the AI places two distinct characters in those precise positions.

### 2. Anatomical Correction
One of the most powerful uses for OpenPose is fixing "bad anatomy" in your initial prompts. 
- If your prompt keeps generating people with three legs, providing an OpenPose skeleton with exactly two legs forces the AI to adhere to the human standard.

### 3. Face & Hand Detail
Sogni's `pose` ControlNet supports specialized "Full Body" detection.
- **Face Keypoints**: Locks the eye-gaze and mouth-shape.
- **Hand Keypoints**: Dramatically improves the success rate of complex hand gestures (e.g., peace signs, gripping objects).

---

## 📐 Strength & Precision

- **Standard Posing (0.7 - 0.8)**: Allows the AI to adjust the "weight" and "bulk" of the character (e.g., turning a thin person's pose into a muscular warrior).
- **Strict Locking (1.0)**: Used for rotoscoping-style workflows where the subject must match the reference frame bit-for-bit.

---

## 🎨 Creative Use Cases

1.  **Dance Video Cleanup**: Take a low-quality video of a dancer, extract the poses, and re-generate them as a high-fidelity cinematic character.
2.  **Fashion Sketching**: Use a model's pose to generate thousands of variations of a clothing line while keeping the "mannequin" consistent.
3.  **Heroic Portraits**: Take a photo of yourself in a simple "Power Pose" and transform into a superhero, a knight, or an astronaut.

---

**Next Volume**: [Vol. 25: ControlNet: Scribble](./VOL_25_CN_SCRIBBLE.md)
