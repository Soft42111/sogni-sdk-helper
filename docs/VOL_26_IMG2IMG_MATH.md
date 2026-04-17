# 📐 Vol. 26: Strength Mathematics: Denoising & Image-to-Image

While ControlNet (Vols. 22-25) provides structural constraints, the **`strength`** parameter (specifically in the context of Image-to-Image or `img2img`) controls the mathematical "evolution" of one image into another. This volume explores the precision math of denoising strength.

---

## 🏛️ The Physics of Strength

In a standard Text-to-Image request, the AI starts with 100% random noise.
In an **Image-to-Image** request, the AI starts with your source image.
The `strength` parameter (often called `denoising_strength`) determines how much noise is added back to that source image before the AI starts its work.

### The Strength Formula:
**`Active_Steps = Total_Steps * Strength`**

- **Strength 0.1**: Only 10% noise is added. The AI will only change minor details like lighting or skin tone. The image remains 90% identical to the source.
- **Strength 0.5**: 50% of the image is replaced with noise. The AI preserves the overall composition and colors but "redraws" every object.
- **Strength 0.8+**: 80% or more noise is added. The AI will likely change the subject, the layout, and the entire aesthetic, using the source only as a very vague color/shape reference.

---

## 🛠️ SDK Implementation

In the Sogni SDK, strength is passed as a top-level parameter when `image` is provided as an input.

```javascript
const project = await sogni.projects.create({
  type: 'image',
  modelId: 'flux1-schnell-fp8',
  image: originalImageBuffer,
  strength: 0.65, // Significant transformation while keeping composition
  positivePrompt: 'A steampunk version of this clock, copper gears, steam pipes'
});
```

---

## 🧪 Optimizing Strength for Different Use Cases

### 1. The "Variations" Workflow
- **Goal**: Generate slight alternatives of a result you like.
- **Recommended Strength**: **0.25 - 0.4**.
- **Result**: The subject's clothes might change slightly, or the background might shift, but the "identity" remains.

### 2. The "Restyling" Workflow
- **Goal**: Turn a photo into a painting or a 3D render.
- **Recommended Strength**: **0.5 - 0.7**.
- **Result**: The structure of the photo is visible, but every pixel is "painted" in the new style.

### 3. The "Pure Inspiration" Workflow
- **Goal**: Use a photo's color palette for a new idea.
- **Recommended Strength**: **0.8 - 0.9**.

---

## ⚠️ Strength vs. CFG (Guidance)

It is a common mistake to confuse these two:
- **Strength**: Determines how much of the *Source Image* is kept.
- **Guidance (CFG)**: Determines how much of the *Prompt* is followed.

**Pro-Tip**: If you find that higher strength is making the image "messy," try lowering the `guidance`. At high strength, the AI has more "freedom," and high guidance can cause it to "over-correct" that freedom into artifacts.

---

## 📊 Performance Impact

Lower strength (e.g., 0.2) results in faster inference times because the worker node is technically performing fewer denoising steps on the GPU. This can lead to lower Spark consumption for high-volume restyling tasks.

---

**Next Volume**: [Vol. 27: Qwen Image Edit](./VOL_27_QWEN_EDIT.md)
