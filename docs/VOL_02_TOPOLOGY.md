# 🗺️ Vol. 02: Supernet Topology: Fast vs. Relaxed Networks

The Sogni Supernet is not a monolithic cloud. It is a tiered network of global compute providers categorized by latency, hardware capabilities, and cost. Understanding this topology is critical for optimizing your application's performance.

---

## ⚡ The Dual-Tier Architecture

To balance the needs of high-speed video generation with cost-effective image synthesis, Sogni divides its workers into two primary tiers: **Fast** and **Relaxed**.

### 1. The Fast Network (`'fast'`)
The Fast Network is the backbone of the Sogni ecosystem. It is designed for near-instant inference and high-throughput multimedia generation.

- **Hardware Profile**: Exclusively composed of high-end NVIDIA GPUs with significant VRAM (RTX 3090, 4090, A100, H100).
- **Required For**: All Video Generation models (WAN, LTX), high-fidelity Audio (ACE-Step), and "Turbo" image models.
- **Latency**: Sub-second synchronization and prioritized job scheduling.
- **Cost**: Premium pricing to compensate high-end hardware providers.

### 2. The Relaxed Network (`'relaxed'`)
The Relaxed Network is designed for volume-heavy image generation where cost optimization is more important than absolute speed.

- **Hardware Profile**: Primarily composed of Apple Silicon (M1, M2, M3 Max/Ultra) and mid-range consumer GPUs.
- **Support**: Limited to Image Generation and LLM Chat. Video is NOT supported on the relaxed network.
- **Latency**: Jobs may wait in a queue longer if worker availability is low.
- **Cost**: Significant discounts compared to the Fast network. Ideal for "Bulk" generation tasks.

---

## 🏗️ Technical Node Distribution

The Supernet uses a **Geographic Proximity Engine** to route requests. If a worker is physically closer to the user (e.g., in the same continent), the WebSocket latency is minimized, leading to faster token delivery in LLM chats and faster frame streaming in video.

### Cluster Management
Workers are organized into clusters. A cluster might be a specialized boutique GPU provider or a decentralized group of miners. The Sogni Orchestrator monitors the "Load Factor" of these clusters in real-time.

---

## 🕹️ Switching Networks in the SDK

The SDK allows you to define a default network at initialization but override it specifically for individual projects.

```javascript
// Global Default
const sogni = await SogniClient.createInstance({ 
  network: 'relaxed' 
});

// Override for a critical Video task
const project = await sogni.projects.create({
  type: 'video',
  network: 'fast', // Forces this project onto high-end GPUs
  modelId: 'ltx23-22b-fp8_t2v_dev',
  ...
});
```

---

## 📊 Topology Monitoring

You can track the health of the different network tiers through the `stats` API:
```javascript
const stats = await sogni.stats.getProjectStats();
console.log('Active Workers (Fast):', stats.fastWorkers);
console.log('Active Workers (Relaxed):', stats.relaxedWorkers);
```

---

**Next Volume**: [Vol. 03: Worker Ecosystem](./VOL_03_WORKERS.md)
