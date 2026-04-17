# 💎 Vol. 18: Flux Architecture: FP8 Precision & Flow Matching

The **Flux** model family is the current "State of the Art" for image generation on the Sogni Supernet. Understanding its architectural shifts from legacy Stable Diffusion is essential for achieving prompt-perfect results.

---

## 🏗️ From U-Net to DiT (Diffusion Transformer)

Legacy models (like SD 1.5) use a **U-Net** architecture. Flux uses a **DiT (Diffusion Transformer)** architecture.
- **Why it matters**: Transformers are better at understanding complex relationships between concepts. Flux is significantly more "intelligent" when parsing long, descriptive prompts with spatial instructions (e.g., "A blue ball *on top of* a red box").

---

## 🌊 Flow Matching vs. Diffusion

While traditional models "diffuse" (remove noise), Flux uses a technique called **Flow Matching**.
- **The Concept**: Instead of predicting noise, the model predicts the "velocity" needed to transform a point in latent space from noise to the target image.
- **Lower Steps, Higher Quality**: Flow Matching allows Flux to achieve high-fidelity results in as few as **4-8 steps** (the `schnell` variant), compared to the 20-50 steps required by legacy models.

---

## 📐 Numerical Precision: FP8 vs. BF16

Sogni provides Flux in multiple precision formats.
- **`flux1-schnell-fp8`**: Uses 8-bit floating point weights.
  - **Advantage**: Smaller memory footprint on Sogni worker nodes, leading to faster startup times and lower Spark costs.
  - **Quality**: Indistinguishable from full-precision for most use cases.
- **`flux1-dev-bf16`**: Uses 16-bit Brain Float. 
  - **Advantage**: Higher numerical stability for complex, high-contrast scenes.

---

## 🕹️ Optimizing Flux in the SDK

### 1. The 1.0 Guidance Rule
Unlike Stable Diffusion, which requires a `guidance` of 7.0-9.0, **Flux is optimized for a guidance of 1.0-1.5**.
- Setting guidance to 7.0 on a Flux model will result in a severely "over-cooked" and unusable image.

### 2. Resolution Sweet Spots
Flux is natively trained at **1024x1024**. Generating below 512px often results in poor feature definition. It is recommended to use the `square_hd` or `16_9_landscape` presets for Flux projects.

---

## 🎨 Creative Capabilities

Flux is world-class at two specific areas:
1.  **Text Rendering**: It can accurately spell words inside images (e.g., "A neon sign that says 'SOGNI'").
2.  **Human Anatomy**: Vastly improved hands, feet, and multi-person compositions compared to legacy models.

---

**Next Volume**: [Vol. 19: Z-Image Turbo](./VOL_19_ZIMAGE_TURBO.md)
