# ⚙️ Vol. 05: Protocol Serialization: Streams & WebSocket Frames

The Sogni Protocol is the binary language spoken between your SDK and the Supernet. This volume dives into the technical details of how data is serialized, framed, and streamed over the wire.

---

## 🏗️ Binary Over JSON (Why?)

Modern multimedia generation involves massive amounts of data—from multi-megabyte image buffers to real-time video frame streams. To minimize latency and overhead, Sogni prioritizes **Binary Serialization** over traditional JSON where possible.

### The Hybrid Message Format
Sogni uses a hybrid framing protocol:
1.  **Metadata (JSON)**: Small control messages (job IDs, percentage updates, status changes) are sent as lightweight JSON.
2.  **Payloads (Binary)**: Media data, latent tensors, and large model metadata are sent as raw binary blobs or `Protobuf`-encoded streams.

---

## 📡 WebSocket Framing Logic

Every message sent over the Sogni WebSocket is "framed" to ensure the SDK can decode it regardless of its size.

### Frame Anatomy:
- **Header**: 4-8 bytes identifying the message type (e.g., `JobProgress`, `JobResult`, `SystemAlert`).
- **Signature**: A checksum to ensure data integrity during transit across decentralized nodes.
- **Payload**: The actual data (JSON string or Binary blob).

---

## 🌊 Streaming Protocols

For LLM Chat and Video Generation, Sogni implements a **Chunked Streaming Protocol**.

### LLM Token Streaming
Tokens are not sent individually; they are sent in "Deltas."
- **Delta Frame**: Contains the new tokens and the sequence index.
- **Why Indexing?**: In a decentralized network, packets can technically arrive out of order. The SDK uses the sequence index to "re-order" the stream on the client side, ensuring the story doesn't skip sentences.

### Video Frame Streaming
Video frames are streamed as they are rendered by the worker.
- **H.264/H.265 Envelopes**: Frames are often packaged in a streaming-ready video container.
- **Partial Downloads**: The SDK allows you to "preview" the video while the worker is still rendering the remaining seconds.

---

## 🛠️ Serialization in the Browser

To handle these high-performance binary streams in a browser environment, the SDK utilizes several modern Web APIs:

### 1. `TextDecoder` / `TextEncoder`
Efficiently converting binary headers into human-readable configuration strings without blocking the main event loop.

### 2. `SharedArrayBuffer` & `Atomics`
If the browser is "Cross-Origin Isolated" (see [Vol. 16](./VOL_16_OPTIMIZATION.md)), the SDK uses shared memory to move binary result data from the WebSocket worker thread to the main UI thread with zero-copy overhead.

### 3. `Blob` & `DataURL`
Once a job is complete, the binary payload is converted into a temporary `Blob` or `ObjectUrl` for easy display in `<img>` or `<video>` tags.

---

## 🧪 Inspecting the Protocol

Developers can monitor the raw protocol traffic by enabling the internal logger:
```javascript
const sogni = await SogniClient.createInstance({
  appId: 'debug-app',
  logLevel: 'debug' // Logs every binary frame to the console
});
```

---

**Next Volume**: [Vol. 06: Direct Registration](./VOL_06_REGISTRATION.md)
