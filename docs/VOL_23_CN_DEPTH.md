# 📏 Vol. 23: ControlNet: Depth Mapping & Spatial Logic

While Canny (Vol. 22) focuses on outlines, **Depth ControlNet** focuses on the 3D volume and spatial relationships within a scene. It allows the Sogni SDK to understand which objects are in the foreground, middle-ground, and background, creating a structured 3D world for the AI to "fill in."

---

## 🎨 How Depth Logic Works

The **Depth** algorithm (often utilizing **MiDaS** or **ZoeDepth**) transforms a source image into a "Depth Map":
- **White/Light**: Indicates objects closest to the camera.
- **Black/Dark**: Indicates objects far in the background or at infinity.
- **Grays**: Represent the gradient of distance (the 3D manifold).

### Why use Depth?
Depth is superior to Canny when the structural lines of the original image are cluttered or confusing, but the "shape" and "pose" of the 3D objects are what matters.

---

## 🛠️ SDK Implementation

Implementation follows the `controlNet` parameter structure, using the `depth` name.

```javascript
const project = await sogni.projects.create({
  type: 'image',
  modelId: 'coreml-cyberrealistic_v70_768',
  positivePrompt: 'A jungle ruins interior, sunlight through vines, overgrown stone',
  controlNet: {
    name: 'depth',
    image: roomPhotoBuffer, // Use a photo of a room or landscape
    strength: 0.9,
    mode: 'balanced'
  }
});
```

---

## 🧪 The "Spatial Advantage"

Depth mapping is critical for several advanced workflows:

### 1. Interior Architecture
If you have a 3D block-out from a tool like Blender or a simple photo of a room, Depth ensures that the furniture the AI generates stays "on the floor" and respects the wall boundaries.

### 2. Complex Character Poses
Unlike edge detection which can get confused by overlapping limbs, Depth distinguishes between an arm in front of a chest and an arm behind a back because they occupy different "depth layers."

### 3. Landscape "Atmospheric Perspective"
By providing a clear distance map, the AI can correctly apply "haze" and "desaturation" to far-away mountains while keeping the foreground foliage sharp and vibrant.

---

## 📐 Tuning the Depth Strength

- **Full Strength (1.0)**: Use this for "Digital Twins" where the spatial layout cannot change by even a millimeter.
- **Soft Strength (0.4 - 0.6)**: Ideal for "Creative Remastering." The AI maintains the general 3D layout but might replace a chair with a rock or a table with a tree stump if it fits the prompt better.

---

## 🎨 Creative Use Cases

1.  **3D Render to Reality**: Take a "clay render" from a 3D app and turn it into a photorealistic photograph.
2.  **Scene Restyling**: Keep a photo's 3D perspective but change the entire environment (e.g., turn a city street into an underwater reef).
3.  **Humanoid Re-dressing**: Use the depth of a person in a pose to generate the same person wearing completely different, high-detail clothing that drapes naturally over their 3D form.

---

**Next Volume**: [Vol. 24: ControlNet: OpenPose](./VOL_24_CN_POSE.md)
