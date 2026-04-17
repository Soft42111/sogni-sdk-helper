# ✍️ Vol. 25: ControlNet: Scribble & Sketch-to-Masterpiece

While Canny and Depth require photographic or high-fidelity inputs, **Scribble ControlNet** is designed to work with rough, human-drawn sketches. It is the bridge between a child's doodle and industrial-grade concept art.

---

## 🎨 How Scribble Logic Works

The **Scribble** preprocessor (often called **HED** or **Holistically-Nested Edge Detection**) is optimized for thick, unrefined lines.
- **Tolerance**: It ignores the "sketchy" nature of a hand-drawn line (the wobbliness or ink blots) and Extracts the primary structural intent.
- **Inversion**: In the Sogni SDK, Scribble usually works on a "White-on-Black" basis, where your white lines on a black canvas define the objects.

### Why use Scribble?
Scribble is the ultimate tool for **Conceptual Ideation**. If you have a vision for a specific building shape or a character's silhouette but lack the 3D skills or photography to represent it, you can simply draw it.

---

## 🛠️ SDK Implementation

Implementation uses the `scribble` name within the `controlNet` parameter.

```javascript
const project = await sogni.projects.create({
  type: 'image',
  modelId: 'coreml-cyberrealistic_v70_768',
  positivePrompt: 'A lush fantasy forest with a glowing crystal tree, intricate bark',
  controlNet: {
    name: 'scribble',
    image: myDoodleBuffer, // A simple black-and-white sketch
    strength: 0.8,
    mode: 'balanced'
  }
});
```

---

## 🧪 The "Concept Art" Workflow

### 1. Silhouette Control
Scribble is excellent at maintaining the broad silhouette of an object while letting the AI "invent" all the internal textures. For example, draw a rough "L" shape and prompt for "A minimalist futuristic sofa."

### 2. Layout Prototyping
Quickly sketch a circle for a sun, a jagged line for mountains, and a flat line for water. The AI will transform these crude shapes into a cinematic landscape without deviating from your composition.

### 3. Iterative Refinement
1.  Draw a scribble and generate an image.
2.  Take the generated image, draw over it (e.g., add a chimney to a house).
3.  Re-process the new sketch via Scribble to "bake" the new detail into the scene.

---

## 📐 Strength vs. Creativity

- **Low Strength (0.4 - 0.5)**: The AI treats your sketch as a "suggestion." It will follow the general placement but may ignore parts of the sketch if they conflict with the prompt's aesthetic.
- **High Strength (0.9 - 1.0)**: The AI is forced to render something inside every white line you drew. This can sometimes lead to "hallucinated" details if your sketch is too cluttered.

---

## 🎨 Creative Use Cases

1.  **Industrial Design**: Sketch a rough shape of a car or a bottle and generate dozens of photorealistic product renders in seconds.
2.  **Architecture**: Hand-draw a floor plan or a building's exterior and see it rendered in different materials (wood, concrete, glass).
3.  **Graphic Design**: Transform a rough handwritten logo idea into high-end "3D Neon" or "Polished Chrome" typography.

---

**Next Volume**: [Vol. 26: Strength Mathematics](./VOL_26_IMG2IMG_MATH.md)
