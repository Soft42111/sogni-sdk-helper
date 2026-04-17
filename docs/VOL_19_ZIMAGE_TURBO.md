# ⚡ Vol. 19: Z-Image Turbo: 1-Step Distillation

For applications requiring ultra-low latency image synthesis—such as real-time interactive apps or dynamic UI generation—the **Z-Image Turbo** model family is the premier choice on the Sogni Supernet.

---

## 🏗️ The Distillation Breakthrough

Standard diffusion models are slow because they require 20 or more sequential denoising steps. Z-Image Turbo uses a technique called **Model Distillation** (specifically Adversarial Diffusion Distillation).
- **The Process**: A larger "Teacher" model (like SDXL) teaches a smaller "Student" model to compress multiple denoising steps into a single pass.
- **The Result**: High-quality images for only **1 to 8 steps** of compute.

---

## 🚀 Performance Metrics

On the Sogni **Fast Network**, Z-Image Turbo models typically achieve:
- **Generation Time**: 400ms to 900ms.
- **Spark Cost**: Significantly lower per-image cost than Flux or High-Quality Z-Image.
- **Throughput**: Ideal for batch generation where 10+ images must be created in seconds.

---

## 🛠️ Optimizing the SDK Call

### 1. Step Range
While these models can run in 1 step, they often produce better results at **4 to 8 steps**. 
```javascript
{
  modelId: 'z_image_turbo_bf16',
  steps: 8, // Sweet spot for quality/speed tradeoff
  guidance: 1.0 // Mandatory 1.0 for distilled turbo models
}
```

### 2. Guidance Calibration
**CRITICAL**: Turbo models have their guidance "baked in" during distillation. 
- You MUST set `guidance: 1.0`. 
- Values higher than 1.0 will cause the latent manifold to collapse, resulting in static or gray images.

---

## 🏗️ Use Cases for Turbo

### Real-Time Interaction
Building an app where the image updates as the user types? Z-Image Turbo is the only model family capable of the sub-second latency required for this experience.

### Game Asset Pipelines
Generating large volumes of repeating assets (icons, sprites, or textures) where speed and consistency are prioritized over cinematic realism.

### Social Media Previews
Dynamic "Hologram" previews or cover art generation for user-generated content.

---

## 🧪 Hybrid Strategies

Many Sogni developers use **Z-Image Turbo** as a "Preview" engine. 
1.  The user tweaks their prompt and sees instant Turbo results.
2.  Once satisfied, the user clicks "Finalize," and the app re-gens the exact same `seed` using the high-quality **Z-Image BF16** or **Flux** model.

---

**Next Volume**: [Vol. 20: SD 1.5 Photorealism](./VOL_20_SD15_STABLE.md)
