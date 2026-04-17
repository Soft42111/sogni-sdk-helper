# 🧪 Vol. 21: Sampler Comparison: Euler vs. DPM++ vs. DDIM

The **Sampler** (or Scheduler) is the mathematical algorithm that determines *how* noise is removed at each step of the diffusion process. Choosing the correct sampler can significantly impact both the final image quality and the generation time.

---

## 🏛️ The Role of the Sampler

If the model is the "Artist," the Sampler is the "Brush stroke technique." 
- Different samplers use different mathematical approximations to move from a noisy latent state to a clean one.
- Some samplers are efficient and converge quickly (ODE solvers), while others are stochastic (Ancestral) and introduce "new" random variation at every step.

---

## 🧬 Primary Sampler Families

### 1. Euler & Euler Ancestral (`euler`, `euler_a`)
- **Characteristics**: Simple, fast, and deterministic (except `euler_a`).
- **Best Use Case**: General-purpose generation and quick drafts. 
- **Ancestral Difference**: `euler_a` never "settles." It continues to change the image even at high step counts, making it great for creative exploration but poor for deterministic reproduction.

### 2. DPM++ Series (`dpmpp_2m`, `dpmpp_sde`)
- **Characteristics**: Highly efficient second-order solvers.
- **Best Use Case**: High-fidelity photorealism. 
- **`2m` (Multistep)**: Converges very smoothly and remains stable at high step counts.
- **`sde` (Stochastic Differential Equation)**: Produces sharper details but is more sensitive to "noise artifacts" if the step count is too low.

### 3. DDIM (`ddim`)
- **Characteristics**: One of the earliest solvers.
- **Best Use Case**: Great for **Inpainting** and **Image-to-Image** tasks where you want to maintain strong structural similarity to the source.

---

## 🏎️ Performance vs. Quality

| Sampler | Convergence Speed | Stability | Notes |
|---------|-------------------|-----------|-------|
| `euler` | ⚡ Fast (20 steps) | ✅ High | Standard default. |
| `dpmpp_2m`| ⚡ Fast (20 steps) | ✅ Excellent | Best for modern high-res. |
| `euler_a` | ⚠️ Slow (30+ steps) | ❌ Low | Constant creative variation. |
| `uni_pc` | 🚀 Ultra-Fast | ✅ High | Optimized for Core-ML. |

---

## 🛠️ Selecting Samplers via the SDK

You can define the sampler in the `projects.create` parameters.

```javascript
const project = await sogni.projects.create({
  type: 'image',
  modelId: 'flux1-schnell-fp8',
  sampler: 'dpmpp_2m_sde_gpu', // Explicitly choosing a specialized DPM++ variant
  steps: 25
});
```

---

## 🧩 Schedulers vs. Samplers

In many SDK contexts, the terms are used interchangeably, but technical implementations often pair them.
- **The Sampler**: The logic of the step calculation.
- **The Scheduler**: The logic that determines *how much noise* to remove at each specific step (e.g., `karras`, `exponential`).
- **Sogni Advantage**: The SDK automatically pairs the most robust Scheduler with your chosen Sampler behind the scenes.

---

## ⚠️ Recommendation for Developers

If you are unsure which to use, stick to **`euler`** for speed or **`dpmpp_2m_sde_gpu`** for cinematic quality. For **Turbo** models, the sampler is often fixed to `euler_a` or `uni_pc` and should not be modified.

---

**Next Volume**: [Vol. 22: ControlNet: Canny](./VOL_22_CN_CANNY.md)
