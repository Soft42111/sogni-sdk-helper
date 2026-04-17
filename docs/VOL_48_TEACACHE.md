# 🚀 Vol. 48: TeaCache Optimization: Temporal Redundancy

High-fidelity video generation (WAN/LTX) is computationally expensive. To accelerate inference on the Sogni Supernet, workers utilize **TeaCache**, a cutting-edge optimization technique that leverages temporal redundancy to skip redundant calculations. This volume explains how to tune this behavior in the SDK.

---

## 🏛️ What is TeaCache?

During a 5-second video, many pixels and features do not change significantly between Frame 1 and Frame 2. 
- **The Concept**: TeaCache analyzes the "Difference" between consecutive frames. If the change is below a certain mathematical threshold, the model "Reuses" the previous computational results (KV-cache) instead of recalculating from scratch.
- **The Benefit**: Dramatic speed improvements (up to 2x faster) with minimal loss in visual quality.

---

## 🛠️ SDK Implementation: The Threshold

The **`teacacheThreshold`** (or `teaCache`) parameter allows you to control the aggressiveness of this optimization. 

```javascript
const project = await sogni.projects.create({
  type: 'video',
  network: 'fast',
  modelId: 'wan_v2.2-14b-fp8_t2v_lightx2v',
  teacacheThreshold: 0.15, // Higher = Faster, but potentially more "ghosting"
  duration: 5,
  fps: 16
});
```

---

## 🧪 Tuning the Threshold

### 1. `0.0` (Disabled / Max Quality)
- Every single frame is calculated with 100% precision.
- Best for high-contrast, fast-moving action scenes where every pixel delta matters.

### 2. `0.1` - `0.2` (The Sweet Spot)
- Significant speed gains without noticeable quality loss.
- Recommended for character portraits, slow cinematic pans, and environmental shots.

### 3. `0.3+` (Draft Mode)
- Extreme speed. 
- **Warning**: At this level, subjects may look "smeary" or experience "ghosting" (temporal lag artifacts) as the AI over-reuses previous results even when the subject has moved.

---

## 📐 Interaction with Denoising Steps

TeaCache is most effective when paired with higher step counts.
- **Why?**: It allows the model to spend "Full Energy" on the first 10 steps to lock in the composition, and then "Cache" the calculations for the remaining 40 steps where only fine details are being refined.

---

## ⚡ Performance Summary

On a Sogni **Fast Network** node (e.g., RTX 4090), enabling TeaCache at `0.15` can reduce the generation time of a 5-second WAN video from 60 seconds down to **35-40 seconds**. This is a critical optimization for user-facing applications where wait times are a primary churn factor.

---

**Next Volume**: [Vol. 49: Persistence & Caching Strategies](./VOL_49_CACHING.md)
