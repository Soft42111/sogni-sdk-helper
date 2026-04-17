# 📡 Vol. 04: Job Dispatch Logic & Orchestration

The Sogni Supernet Orchestrator is the hidden intelligence that connects your SDK requests to the global worker pool. This volume details the lifecycle of a job through the decentralized dispatch pipeline.

---

## ⚡ The Request-Dispatch Cycle

When you call `sogni.projects.create()`, a multi-stage process is triggered across the Sogni protocol layer.

### 1. Project Registration & Signing
The SDK first packages your parameters (model, prompts, steps) into a **Job Declaration**.
- **Signing**: If using an API key, the request is cryptographically signed to prevent intercept and replay attacks.
- **Credit Reservation**: The orchestrator checks your Spark/SOGNI balance and "locks" the estimated cost of the project to ensure payment for the worker.

### 2. Node Selection (The Matchmaker)
The orchestrator filters the thousands of active workers based on:
- **Capability**: Does the worker have the specified `modelId` loaded in VRAM?
- **Network Tier**: Is the user requesting `fast` or `relaxed`?
- **Latency**: Which worker has the lowest round-trip-time (RTT) to the user?
- **Load Balancing**: Distributing jobs to prevent overloading a single cluster.

### 3. The Job Commitment
Once a worker is selected, they receive a **Challenge**. The worker must accept the job within milliseconds, or the orchestrator immediately rotates to the next candidate. This ensures that the user never sees a "stuck" generation state.

---

## 🔄 Real-Time State Sync

As the worker processes the inference, they stream state updates directly back to the orchestrator, which then forwards them to your SDK instance via the WebSocket.

| State | Internal Trigger | SDK Event |
|-------|------------------|-----------|
| `QUEUED` | Job is in the cluster queue. | Project 'updated' |
| `FETCHING` | Worker is downloading necessary LoRA/Assets. | Project 'updated' |
| `GENERATING` | GPU is performing denoising steps. | Project 'progress' |
| `UPLOADING` | Final media is being encrypted and stored. | Project 'updated' |
| `COMPLETED`| URL is available in the result. | Project 'completed' |

---

## 🛡️ Fault Tolerance & Auto-Reassignment

In a decentralized environment, workers can go offline unexpectedly (e.g., a power outage or network drop). The Sogni Orchestrator implements an **Active Watchdog** for every job.

- **Timeout Detection**: If a worker stops sending heartbeats or fails to increase progress for 15 seconds, the orchestrator "kills" the assignment.
- **Seamless Re-Dispatch**: The job is automatically sent to a new worker. The SDK receives a `worker_changed` signal, and the user's progress bar might reset or "jump," but the overall project remains alive.

---

## 📐 Rate Limiting & "App ID" Logic

To ensure fair use across the Supernet, the orchestrator utilizes your `appId`.
- **Throttling**: High-volume apps should coordinate with Sogni to increase their concurrency limits.
- **Prioritization**: Paid Spark accounts always receive priority in the dispatch queue over free/test accounts.

---

**Next Volume**: [Vol. 05: Protocol Serialization](./VOL_05_PROTOCOL.md)
