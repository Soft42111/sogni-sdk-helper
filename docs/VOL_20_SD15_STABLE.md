# 🎞️ Vol. 20: Stable Diffusion 1.5 Photorealism

While Flux and Z-Image represent the cutting edge, the legacy **Stable Diffusion 1.5** architecture remains a cornerstone of the Sogni Supernet due to its massive ecosystem of community fine-tunes and its unparalleled performance in specific photorealistic niches.

---

## 🏛️ The SD 1.5 "Core-ML" Optimization

On the Sogni **Relaxed Network**, SD 1.5 models are often converted to **Core-ML** format.
- **Hardware Synergy**: This allows them to run with extreme efficiency on Apple Silicon (M-series) workers.
- **Developer Impact**: This makes SD 1.5 the most cost-effective model family for bulk generation tasks.

---

## 📸 The "Cyberrealistic" Pipeline

One of the most popular SD 1.5 models on Sogni is `coreml-cyberrealistic_v70_768`. This model is specifically tuned for:
- **Skin Texture**: Accurate pores, freckles, and light sub-surface scattering.
- **Lighting**: Cinematic global illumination and accurate shadow falloff.
- **Portraits**: Exceptional performance on human faces and expressions.

---

## 🛠️ SDK Implementation Best Practices

### 1. Step Count (The "Quality Plateau")
Unlike Flux, SD 1.5 requires more steps to "converge" a high-fidelity image.
- **Drafts**: 20 steps.
- **High Quality**: 30 - 45 steps.
- **Note**: Going beyond 50 steps rarely improves quality and may actually introduce "over-sharpening" artifacts.

### 2. Guidance Calibration
The "Classic" guidance range applies here.
- **7.0 - 9.0**: The optimal balance between creativity and prompt adherence.
- **Higher (12.0+)**: Used for very specific, complex prompts where the model might otherwise ignore subtle instructions.

### 3. Native Resolution (768px)
While the base SD 1.5 was trained at 512x512, the Sogni variants are often tuned for **768x768**.
- **Avoid 1024px+**: Generating at 1024px directly with SD 1.5 often results in "Duplication" (e.g., two people appearing instead of one). For high-res SD 1.5 outputs, it is better to generate at 768px and up-scale.

---

## 🧩 Modularity & Fine-Tuning

SD 1.5 is the primary target for **LoRAs** (Low-Rank Adaptation) and **Embeddings**. 
- The Sogni SDK allows you to inject these fine-tunes into your prompt strings to achieve specific styles, character likenesses, or complex visual aesthetics that base models cannot produce.

---

## 🧪 Comparison of Legacy vs. Modern

| Feature | SD 1.5 (Legacy) | Flux (Modern) |
|---------|-----------------|---------------|
| **Text Rendering** | ❌ Poor | ✅ Excellent |
| **Hands/Anatomy** | ⚠️ Average | ✅ Excellent |
| **Speed** | ✅ Very Fast | ⚠️ Moderate |
| **Efficiency** | ✅ High (Relaxed) | ⚠️ Standard (Fast) |

---

**Next Volume**: [Vol. 21: Sampler Comparison](./VOL_21_SAMPLERS.md)
