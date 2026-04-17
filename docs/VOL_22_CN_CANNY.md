# 🧬 Vol. 22: ControlNet: Canny Edge Detection

ControlNet is a specialized neural network architecture that grants the Sogni SDK precise spatial control over the diffusion process. **Canny Edge Detection** is the most widely used ControlNet variant, allowing you to lock the AI's generation to the structural outlines of a source image.

---

## 🎨 How Canny Works

The **Canny** algorithm is a multi-stage process that extracts the "essential edges" from an image.
1.  **Noise Reduction**: Smooths the image to remove speckle noise.
2.  **Gradient Calculation**: Finds where brightness changes most rapidly (edges).
3.  **Thinning**: Reduces thick edges down to single-pixel lines.
4.  **Hysteresis**: Filters out weak edges based on a threshold.

### Why use Canny?
If you have a specific building, product, or logo, and you want to "restyle" it without changing its physical dimensions or shape, Canny is the most reliable tool.

---

## 🛠️ SDK Implementation

To use Canny, you must provide a `controlNet` object within your image project parameters.

```javascript
const project = await sogni.projects.create({
  type: 'image',
  modelId: 'coreml-cyberrealistic_v70_768',
  positivePrompt: 'A futuristic city made of crystalline glass, 8k render',
  controlNet: {
    name: 'canny',
    image: sourceImageBuffer, // The image to extract edges from
    strength: 0.85,           // How strictly to follow the edges (0.0 - 1.0)
    mode: 'balanced',         // 'prompt_priority', 'cn_priority' or 'balanced'
    guidanceStart: 0,         // When to start applying (0 = beginning)
    guidanceEnd: 1.0          // When to stop applying (1.0 = end of steps)
  }
});
```

---

## 🧪 Tuning Performance

### 1. Strength (0.0 - 1.0)
- **0.5**: The AI follows the general shape but might "interpret" details more freely.
- **0.9**: The AI is strictly locked to every line. This is best for architectural rendering or strict product styling.

### 2. Guidance End (Temporal Lock)
Applying ControlNet for the entire duration (1.0) can sometimes lead to a "stiff" or over-processed look.
- **Pro Tip**: Set `guidanceEnd` to **`0.8`**. This allows the AI to spend the last 20% of the steps "polishing" the fine textures (like skin or clouds) without being fighting for structural perfection.

---

## ⚠️ Model Compatibility

Canny ControlNet is traditionally associated with the **SD 1.5** and **SDXL** families.
- On the Sogni Supernet, Canny is most robust when paired with the `coreml-cyberrealistic` models on the **Relaxed Network**, where specialized hardware accelerators optimize the edge-map processing.

---

## 🎨 Creative Use Cases

1.  **Logo Restyling**: Give a corporate logo a "lava" or "space" texture while keeping the logo perfectly readable.
2.  **Interior Design**: Take a photo of a messy room, extract the edges, and prompt for "A minimalist Nordic living room."
3.  **Anime to Realism**: Use the structural lines of an anime frame and redraw it with a photorealistic model.

---

**Next Volume**: [Vol. 23: ControlNet: Depth](./VOL_23_CN_DEPTH.md)
