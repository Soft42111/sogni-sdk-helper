# 🏗️ Core Architecture: A Deep Dive into the SDK State Machine

The Sogni SDK is not a simple wrapper around a REST API. It is a real-time, event-driven engine designed to maintain a persistent connection to the Sogni Supernet. Understanding the inner workings of this architecture is critical for building stable, production-grade applications.

---

## 📡 The WebSocket Lifecycle

The heart of the SDK is a stateful WebSocket connection. Unlike REST, which is stateless and requires polling, the Sogni SDK uses a bidirectional stream to provide real-time updates.

### 1. Handshake & Authentication
When you call `SogniClient.createInstance()`, the SDK initiates a connection to the Supernet gateway. This process includes:
- **Capability Negotiation**: The client and server agree on versioning and supported features.
- **Auto-Auth**: If an `apiKey` is provided, the SDK injects it into the initial connection headers.
- **State Restoration**: If the client is reconnecting, the SDK attempts to recover the session state.

### 2. The Heartbeat Mechanism
To ensure the connection remains alive (especially through aggressive firewalls and proxies), the SDK implements a sub-5 second heartbeat. 
- If the server misses a heartbeat, the SDK triggers a **Reconnect Circuit Breaker**, attempting logarithmic backoff to restore the link.

---

## 🗃️ Reactive Entities: Projects & Jobs

The Sogni SDK uses an Object-Oriented, reactive model for managing inference tasks.

### `Project` Lifecycle
A **Project** is your high-level container for a generation request.
- **Creation**: `sogni.projects.create(params)` initializes the Project.
- **Validation**: The SDK pre-validates parameters locally (e.g., checking if WAN dimensions are divisible by 16) before sending the request to the network.
- **Orchestration**: A single Project can manage multiple Jobs (e.g., generating 4 images at once).

### `Job` Lifecycle
A **Job** represents a single discrete output (one image, one video, or one audio file).
- `CREATED`: The job is registered but not yet assigned to a worker.
- `PENDING`: The job is in the Supernet queue.
- `IN_PROGRESS`: A decentralized worker has accepted the job and is currently computing the inference.
- `COMPLETED`: The job is finished, results are encrypted and uploaded, and a 24-hour URL is generated.
- `FAILED`: An error occurred (NSFW filter, worker timeout, or credit exhaustion).

---

## 🎨 Reactive Event Bus

The SDK uses a `TypedEventEmitter` to notify your application of changes. This is superior to `async/await` for long-running tasks because it provides granular progress.

| Event | Entity | Description |
|-------|--------|-------------|
| `connected` | Client | Fired when the WebSocket is fully authenticated. |
| `progress` | Project | Returns a percentage (0-100) of the total project completion. |
| `jobCompleted`| Project | Fired as soon as an individual job within the project finishes. |
| `completed` | Project | Fired when ALL jobs within a project have finished successfully. |
| `failed` | Project | Fired if the entire project or a critical job fails. |

---

## 🔐 Security & Result Encryption

One of the unique features of the Sogni Supernet is the protection of generated content.
1. **Worker Encryption**: When a worker finishes a job, the media is encrypted *on the worker device* using a session-specific key.
2. **Secure Upload**: The encrypted blob is sent to Sogni's storage.
3. **Timed Access**: The resulting URLs are transient (24 hours). Your application should download or cache results locally if permanent storage is required.

---

## 🚀 Performance Considerations

### Multi-Tab Synchronization
The SDK is designed for modern browsers. It includes logic to handle multiple browser tabs. Only one "Master Tab" maintains the primary WebSocket connection, while "Replica Tabs" communicate via a shared broadcast channel (Cross-Tab Sync), reducing redundant traffic and token usage.

### COOP/COEP Headers
For maximum performance (especially with video generation and streaming), it is recommended to serve your application with the following headers:
```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```
These headers enable high-performance `SharedArrayBuffer` support in modern browsers, which the SDK uses to optimize binary data handling.

---

**Next Step**: [02_GETTING_STARTED_AND_AUTH.md](./02_GETTING_STARTED_AND_AUTH.md)
