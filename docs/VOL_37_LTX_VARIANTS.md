# 🕹️ Vol. 37: LTX-2.3: Dev (Quality) vs. Distilled (Speed)

The Sogni Supernet provides two distinct variants of the LTX-2.3 architecture: **Dev** and **Distilled**. Choosing the right one is a trade-off between absolute cinematic perfection and rapid iteration speed.

---

## 🏛️ Architecture Breakdown

### 1. LTX-2.3 Dev (The Gold Standard)
The "Dev" version is the full-parameter, high-fidelity model. It is designed for professional filmmakers and creators who need the highest possible realism.
- **Model ID**: `ltx23-22b-fp8_t2v_dev`.
- **Steps**: Typically requires 25-50 steps for convergence.
- **Inference Time**: Longer than the distilled version (approx. 2-3x).
- **Quality**: Superior texture handling, more accurate lighting, and better "small feature" preservation (e.g., eyes, fingers).

### 2. LTX-2.3 Distilled (The Iteration Engine)
The "Distilled" version uses a technique called **Consistency Distillation** or **Hyper-Sampling** to reduce the required step count without a massive loss in structural quality.
- **Model ID**: `ltx23-22b-fp8_t2v_distilled`.
- **Steps**: Achieves high quality in as few as **4 to 8 steps**.
- **Inference Time**: Extremely fast (approx. 15-30 seconds for a 5-second video).
- **Quality**: While excellent, it can sometimes exhibit "flatter" lighting or "smother" textures than the Dev version.

---

## 🛠️ When to Use Which?

| Feature | Use LTX Dev | Use LTX Distilled |
|---------|-------------|-------------------|
| **Final Render** | ✅ Yes | ❌ Only if speed is priority |
| **Prototyping** | ❌ No | ✅ Yes |
| **Dynamic Apps**| ❌ No | ✅ Yes |
| **High Texture**| ✅ Yes | ⚠️ Moderate |
| **Budget** | ⚠️ Premium Costs | ✅ Cost Effective |

---

## 🧬 Calibrating the SDK Parameters

### For LTX Dev:
```javascript
{
  modelId: 'ltx23-22b-fp8_t2v_dev',
  steps: 30,
  guidance: 3.0 // Standard LTX guidance
}
```

### For LTX Distilled:
```javascript
{
  modelId: 'ltx23-22b-fp8_t2v_distilled',
  steps: 8,
  guidance: 1.0 // Distilled models are often fixed to 1.0 or very low
}
```

---

## ⚠️ The "Distillation Artifacts"

When using the Distilled model, watch out for:
- **Motion Blur**: At very low step counts (1-2 steps), fast-moving objects might leave "trails."
- **Contrast Shifts**: High-contrast scenes can sometimes "crush" blacks or "blow out" highlights in the distilled manifold.

---

## 🧪 Hybrid Workflow Recommendation

1.  **Drafting**: Use **LTX Distilled** (8 steps) to find the perfect seed and character composition.
2.  **Upscaling**: Once satisfied, re-run the exact same `seed` and `prompt` using **LTX Dev** (30 steps) for the final cinematic output.

---

**Next Volume**: [Vol. 38: Video ControlNet Logic](./VOL_38_VIDEO_CN.md)
