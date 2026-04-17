# 👷 Vol. 03: The Worker Ecosystem: Hardware Profiles

The Sogni Supernet is powered by a diverse array of computational nodes known as "Workers." Each worker is a physical machine—ranging from a home gaming PC to an industrial GPU cluster—that has joined the DePIN network to provide inference services.

---

## 🛠️ Worker Hardware Tiers

Understanding the hardware powering the Supernet helps developers predict inference latencies and choose the correct models for their users.

### 🟢 NVIDIA "Titan" Class (Fast Network)
This tier consists of the world's most powerful consumer and enterprise GPUs.
- **GPUs**: RTX 4090 (24GB VRAM), RTX 3090, A100, H100.
- **Inference Profile**: Extremely fast for all modalities. A 1024x1024 Flux image typically renders in 1-3 seconds.
- **Video Logic**: These workers are essential for the **WAN 2.2** and **LTX-2.3** models, which require massive VRAM pools for temporal processing.

### ⚪ Apple Silicon "Unified" Class (Relaxed Network)
The Sogni Supernet is unique in its ability to leverage Apple's M-series chips for AI inference at scale.
- **Chips**: M1 Max/Ultra, M2 Max/Ultra, M3 Max/Ultra.
- **Inference Profile**: Exceptional for standard image models (SD 1.5, CoreML models). Slower for high-parameter models compared to NVIDIA, but extremely energy-efficient.
- **VRAM Advantage**: Unified memory allows these workers to handle large models (like 30B+ LLMs) more cost-effectively than mid-range NVIDIA cards.

---

## 🔒 Security & Sandboxing

A primary concern in a decentralized network is security. How can you trust a random worker with your prompts and results?

### 1. Zero-Knowledge Intent
Workers do not know the identity of the user requesting the task. They receive an encrypted job packet, perform the math, and return the result.

### 2. Result Encryption (AES-GCM)
The resulting media (image, video, or audio) is **encrypted on the worker's hardware** before it even leaves the device. The data is only decrypted by the SDK on the user's local machine or a secure Sogni cache.

### 3. TEE Potential
The Supernet protocol is evolving to support **Trusted Execution Environments (TEEs)**, ensuring that even the worker's root user cannot intercept the latent activations during inference.

---

## ⚖️ Proof of Inference (PoI)

To prevent workers from "faking" results or submitting low-quality noise to earn rewards, Sogni implements **Proof of Inference**.
- **Consensus Checks**: For high-value tasks, the same job may be sent to multiple workers, and their results are compared bit-for-bit.
- **Reputation Scoring**: Workers are assigned a "Karma" score based on their uptime, accuracy, and resolution speed. Workers with low Karma are excluded from the Fast network.

---

## 🎛️ Choosing a Worker via the SDK

While the Sogni Orchestrator handles node selection automatically, your choice of `modelId` and `network` indirectly selects the worker class.

| Model | Recommended Network | Worker Hardware |
|-------|---------------------|-----------------|
| Flux (Schnell) | `fast` | RTX 4090/A100 |
| WAN 2.2 Video | `fast` | RTX 4090 (24GB+) |
| SD 1.5 | `relaxed` | Apple M2/M3 |
| Qwen 3.5 (128K) | `fast` | H100 / A100 Cluster |

---

**Next Volume**: [Vol. 04: Job Dispatch Logic](./VOL_04_DISPATCH.md)
