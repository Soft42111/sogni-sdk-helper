# 🎨 Image Synthesis Master Class: From Flux to ControlNet

This module covers the extensive image generation capabilities of the Sogni SDK, detailing exactly how to harness decentralized GPU power for high-fidelity visual synthesis.

---

## 🎭 The Multi-Model Landscape

Sogni provides access to several frontier families of image models. Choosing the right one is critical for achieving your desired aesthetic and performance.

| Model ID | Architecture | Best Use Case | Inference Steps |
|----------|--------------|---------------|-----------------|
| `flux1-schnell-fp8` | Flux | High-fidelity, photorealism | 4 - 8 |
| `z_image_turbo_bf16` | Z-Image | Absolute speed, UI assets | 8 - 12 |
| `z_image_bf16` | Z-Image | High quality, creative | 20 - 30 |
| `qwen_image_edit_2511_fp8` | Qwen VLM | Multi-image merge / Edit | 20 - 35 |
| `coreml-cyberrealistic_v70`| SD 1.5 | Fine-tuned photorealism | 20 - 40 |

---

## 🛠️ Basic Generation Syntax

To create an image project, you must specify the `type: 'image'` and define your parameters.

```javascript
const project = await sogni.projects.create({
  type: 'image',
  modelId: 'flux1-schnell-fp8',
  positivePrompt: 'A futuristic skyscraper surrounded by neon foliage, hyper-detailed, 8k',
  negativePrompt: 'blurry, distorted, low quality, humans',
  stylePrompt: 'cyberpunk anime', // Injected into the prompt context
  numberOfMedia: 4, // Generate a 2x2 grid
  steps: 4,       // Steps vary dramatically by model
  guidance: 1.0,  // Adherence to prompt (higher = stricter)
  outputFormat: 'jpg' // 'png' (lossless) or 'jpg' (optimized)
});

const imageUrls = await project.waitForCompletion();
```

---

## 📏 Dimensions & Size Presets

Sogni supports flexible aspect ratios through a preset system or custom overrides.

### Using Presets
Presets are optimized for specific models to prevent "doubling" artifacts.
- `square`: 512x512
- `square_hd`: 1024x1024 (Flux standard)
- `portrait_mobile`: 768x1344
- `landscape_widescreen`: 1344x768

### Custom Dimensions
For exact pixel control:
```javascript
{
  sizePreset: 'custom',
  width: 1920,
  height: 1080
}
```

---

## 🧠 Advanced Synthesis: ControlNet

**ControlNet** is a neural network structure that allows you to add extra conditions (spatial constraints) to your generation.

| ControlNet Type | Input Required | Use Case |
|-----------------|----------------|----------|
| `canny` | Edge Map | Maintaining precise structural outlines. |
| `depth` | Depth Map | Preserving three-dimensional composition. |
| `openpose` | Bone Layout | Defining a specific human pose. |
| `scribble` | Rough Sketch | Turning a doodle into a masterpiece. |
| `instrp2p` | Context Image | "Make the person look older" (editing). |

### Implementation Detail
```javascript
const project = await sogni.projects.create({
  type: 'image',
  modelId: 'coreml-cyberrealistic_v70_768',
  positivePrompt: 'A knight in glowing armor',
  controlNet: {
    name: 'openpose',
    image: myPoseBuffer, // File, Blob, or Buffer
    strength: 0.85,    // 1.0 = full control, 0.0 = prompt only
    mode: 'balanced',  // 'prompt_priority' or 'cn_priority'
    guidanceStart: 0,  // Start applying at step 0
    guidanceEnd: 0.8   // Stop applying at 80% of steps
  }
});
```

---

## 🖼️ Image-to-Image (Starting Image)

For variations or restyling existing assets:
- **`startingImage`**: The source image.
- **`startingImageStrength`**: The percentage of influence the source has.
  - `0.1`: Almost ignored (high variation).
  - `0.9`: Barely changed (low variation).

---

## 🧪 Technical Parameter Nuances

### Guidance Scale (CFG)
- **Turbo Models (`flux1-schnell`, `z_image_turbo`)**: Optimal range is **1.0 - 1.5**. Higher values often break the image.
- **Standard Models**: Optimal range is **7.0 - 9.0**.

### Denoising Steps
- **Distilled Models**: 4-8 steps.
- **High-Quality Models**: 20-50 steps.
> [!WARNING]
> Selecting too many steps on a Distilled/Turbo model will not increase quality; it will create "deep fried" artifacts and waste tokens.

---

**Next Step**: [04_VIDEO_TEMPORAL_DYNAMICS_WAN.md](./04_VIDEO_TEMPORAL_DYNAMICS_WAN.md)
