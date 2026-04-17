# 🚀 Vol. 16: Browser Optimization: Shared Memory & Headers

To achieve "Industrial-Grade" performance with the Sogni SDK, especially when generating high-resolution video or streaming large LLM contexts, you must optimize the browser's execution environment. This volume covers the critical configurations required for maximum throughput.

---

## 🏗️ Cross-Origin Isolation (COI)

The Sogni SDK utilizes **`SharedArrayBuffer`** to move binary data between worker threads (WebSocket handling) and the main ui thread (Rendering) with zero-copy overhead. However, modern browsers disable `SharedArrayBuffer` by default to mitigate Spectre-style hardware attacks.

### Enabling Professional Performance
To unlock these features, your web server must serve the application with the following two headers:

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

### Impact of COI:
- **Zero-Stutter Streaming**: Large video buffers are received without freezing the UI.
- **Improved FPS**: Faster frame-to-canvas rendering for video previews.
- **Lower Memory Usage**: Prevents redundant string-to-buffer copies of binary media.

---

## ⚡ JavaScript Event Loop Hygiene

The Sogni SDK is heavily event-driven. If your application's main thread is "blocked" by heavy React re-renders or complex data processing, the SDK may miss critical WebSocket frames or fail heartbeats.

### Optimization Strategies:
1.  **Throttling Progress UI**: Do not trigger a full React state update for every `0.1%` progress increment. Throttle updates to `100ms` intervals.
2.  **Worker-Side Processing**: If you need to perform heavy calculations on the resulting image (e.g., resizing or filter application), use a dedicated **Web Worker**.

---

## 📦 Cache Management

Sogni results are transient (24 hours). A high-performance app should implement an **Optimistic Local Cache**.

### 1. The `Blob` Cache
When the SDK returns a `resultUrl`, fetch the result immediately and convert it to a local `Blob` or `ObjectUrl`.
```javascript
const response = await fetch(resultUrl);
const blob = await response.blob();
const localUrl = URL.createObjectURL(blob);
// Display this localUrl to ensure it works even if network drops
```

### 2. IndexedDB Storage
For persistent "User Galleries," store the binary blobs in **IndexedDB** using a library like `dexie`. This allows the application to load thousands of past generations instantly without making a single network request to the Sogni storage.

---

## 📶 Network Concurrency

Browsers limit the number of simultaneous connections to a single domain. 
- **The Good News**: Sogni only uses ONE WebSocket connection for all tasks.
- **The Caveat**: If your application is simultaneously fetching 50 large images from the Sogni CDN, it may delay the WebSocket metadata from reaching the orchestrator. 

**Recommendation**: Use a "Lazy Loading" pattern for images in your gallery to keep the network pipe clear for active generation jobs.

---

## 🧪 Performance Monitoring

You can measure the SDK's internal performance by checking the ping latency:
```javascript
const sogni = await SogniClient.createInstance({ ... });
sogni.apiClient.on('pong', (latency) => {
  console.log(`Network Latency to Supernet: ${latency}ms`);
});
```

---

**Next Volume**: [Vol. 17: Latent Diffusion Fundamentals](./VOL_17_DIFFUSION_THEORY.md)
