# 🖼️ Vol. 17: Latent Diffusion Fundamentals: Noise Prediction

To master image generation with the Sogni SDK, one must understand the underlying physics of **Latent Diffusion**. This volume explains the transition from pure random noise to coherent high-fidelity images.

---

## 🏛️ What is "Latent" Space?

Traditional image generation in pixel space is computationally expensive (e.g., a 1024x1024 image contains ~3 million values).
- **The Solution**: Diffusion models operate in a **Latent Space**—a compressed mathematical representation of the image.
- **The Latent**: A typical 1024x1024 image is compressed into a 128x128 latent manifold. The AI performs all its "thinking" in this compressed space, and only converts it back to pixels (via a **VAE Decoder**) at the very end.

---

## 🌫️ The Forward & Reverse Process

### 1. Forward Diffusion (Adding Noise)
During training, the model is taught by taking a clean image and gradually adding Gaussian noise until it becomes a static, unintelligible mess.

### 2. Reverse Diffusion (The Inference Pass)
When you call the Sogni SDK, the worker starts with a **Seed** (a block of random noise).
- **Step 1**: The model (U-Net or Transformer) looks at the noise and your prompt. It "predicts" how much noise it can remove to make the image match your prompt.
- **Iteration**: This prediction happens over multiple **Steps**.
  - **Early Steps**: The overall composition and layout are decided (e.g., "There is a mountain here").
  - **Late Steps**: Fine details like textures, lighting, and skin pores are refined.

---

## 🧬 Adherence: The CFG Scale

**Classifier-Free Guidance (CFG)**, represented by the `guidance` parameter in the SDK, controls how hard the AI tries to match your prompt.

- **Low Guidance (1.0 - 3.0)**: The AI is very creative and "dreamy." It may ignore parts of your prompt but produces aesthetically balanced results.
- **High Guidance (7.0 - 12.0)**: The AI is strictly tethered to your prompt. However, extremely high values can cause "color burning" or over-saturated artifacts.

---

## 🎲 The Power of the Seed

The `seed` is the starting point of the noise.
- **Deterministic Results**: If you use the same prompt, the same model, and the **same seed**, the output will be identical. 
- **Exploration**: If you find an image you like (e.g., a specific pose or composition), you can "lock" the seed and slowly tweak your prompt or `guidance` to refine the result.

---

## 📐 Resolution & Latent Tiling

Because models are trained on specific resolutions (e.g., 512x512 or 1024x1024), generating images outside these ratios can cause "Multiple Subject" artifacts (e.g., a person with two heads).
- **The SDK Fix**: Always use Sogni's **Size Presets** when possible. They are mathematically aligned to the native latent grid of the specific `modelId`.

---

**Next Volume**: [Vol. 18: Flux Architecture](./VOL_18_FLUX_DEEP.md)
