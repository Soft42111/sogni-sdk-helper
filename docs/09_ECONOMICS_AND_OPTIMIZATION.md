# ⚖️ Economics & Optimization: Token Math and Performance

Integrating the Sogni SDK into a production environment requires a deep understanding of the Supernet’s economy and the technical optimizations necessary to deliver a low-latency user experience.

---

## 💰 Token Cost Estimation

Sogni utilizes a decentralized marketplace pricing model. While the Supernet handles the exact billing, you can estimate the cost of a project using the following logic.

### Image Token Formula
The cost of an image is primarily determined by the **Pixel Count** and **Inference Steps**.
**`Cost ∝ (Width * Height * Steps * ModelMultiplier)`**

- **Standard (1024x1024, 20 steps)**: 1x Cost Base.
- **HD (2048x2048, 20 steps)**: **4x Cost Base** (because pixel count is 4x).
- **Turbo (1024x1024, 4-8 steps)**: Much lower cost due to reduced step count.

### Video Token Formula
Video is significantly more intensive due to the temporal dimension.
**`Cost ∝ (Width * Height * FrameCount * Steps * TemporalMultiplier)`**

- **WAN 2.2**: Uses a fixed frame-generation logic, so cost is strictly tied to `duration`.
- **LTX-2.3**: Cost increases linearly with `fps` (since `fps` increases the number of generated frames).

---

## ⚡ Technical Optimizations

### 1. TeaCache (for Video)
For WAN 2.2 models, you can significantly reduce inference time by using the `teacacheThreshold`.
- **Logic**: It identifies "visually redundant" frames in the temporal block and skips the full denoising pass on them.
- **Recommendation**: Set to **`0.3`** for most scenarios. This can reduce render time by **30-40%** with negligible impact on quality.

### 2. Output Format Selection
- **`png`**: Lossless but creates large payloads (can be 5MB+ for 1024px). Increases browser download time.
- **`jpg`**: Lossy but extremely efficient (0.5MB - 1MB). Recommended for real-time chat apps.

### 3. Model Prefetching
Use `sogni.projects.waitForModels()` to ensure the model metadata is cached locally before the user attempts to generate. This prevents a "loading" glitch when the user first opens the creation UI.

---

## 📡 Networking Best Practices

### Multi-Tab Concurrency
The Sogni SDK handles multiple browser tabs automatically using a "Leader-Follower" pattern. Only the Leader tab maintains the WebSocket. However, you should:
- Avoid initializing the `SogniClient` more than once per user session.
- Ensure only one instance of the SDK is active in your application's state (use a context provider in React/Vue).

### Cross-Origin Isolation
If you are processing video or handling large binary buffers, your server MUST send these headers:
```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```
This unlocks **high-throughput memory management**, which eliminates the small "stutters" sometimes felt when the SDK receives large binary chunks from the WebSocket.

---

## 📊 Monitoring Usage

Always monitor your balance before initiating large projects to prevent the `402 Insufficient Credits` error, which can disrupt the user experience.

```javascript
const balance = await sogni.account.getBalance();
if (balance.spark < minThreshold) {
  triggerTopUpUI();
}
```

---

**Next Step**: [10_ERROR_ENCYCLOPEDIA.md](./10_ERROR_ENCYCLOPEDIA.md)
