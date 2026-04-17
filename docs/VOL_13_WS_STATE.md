# 📡 Vol. 13: WebSocket State Machine: Handshakes & Heartbeats

The Sogni SDK maintains a sophisticated, stateful connection to the Supernet. This volume provides a deep dive into the internal state machine that governs the WebSocket's lifecycle.

---

## 🏛️ The State Manifold

The SDK's connection is always in one of five distinct states. You can monitor this via `sogni.apiClient.wsClient.status`.

1.  **`IDLE`**: Initial state. No connection attempt has been made.
2.  **`CONNECTING`**: The TCP handshake is in progress. The SDK is negotiating protocols with the Supernet gateway.
3.  **`AUTHENTICATING`**: The connection is established, but the SDK is verifying its `apiKey` or `sessionToken`.
4.  **`CONNECTED`**: The state of readiness. Bidirectional streams (Heartbeats and Jobs) are active.
5.  **`DISCONNECTED`**: The connection has been closed gracefully or due to a network error.

---

## 🤝 The Connection Handshake

When you trigger a connection, the SDK performs a multi-phase negotiation:
- **Phase 1: WebSocket Upgrade**: Standard HTTP-to-WS upgrade (`ws://` or `wss://`).
- **Phase 2: Capabilities Report**: The SDK sends its `appId`, version, and network tier preferences.
- **Phase 3: Auth Validation**: If successful, the gateway returns a `SessionStarted` frame containing the user's current project states and balance.

---

## ❤️ The Heartbeat Protocol

To prevent Silent Disconnection (where a router drops a "dead" connection without notifying either party), Sogni utilizes a high-frequency **Heartbeat** system.

### How it works:
1.  **`PING`**: Every 5 seconds, the SDK sends a tiny binary packet to the server.
2.  **`PONG`**: The server must reply with a corresponding packet within 2 seconds.
3.  **Timeout**: If three consecutive Pongs are missed, the SDK enters the **`RECONNECTING`** state (see [Vol. 15](./VOL_15_RECONNECT.md)).

---

## 📦 Message Framing & Multiplexing

The WebSocket is a single "pipe," but it handles multiple channels of data simultaneously using **Multiplexing**.

- **Channel 0 (Control)**: Heartbeats, system alerts, and global balance updates.
- **Channel 1 (Job Metadata)**: % progress, ETAs, and job state changes.
- **Channel 2 (Binary Stream)**: The actual media frame data or LLM token deltas.

This separation ensures that a massive video frame being uploaded doesn't block critical "System Alert" messages from reaching the client.

---

## 🛠️ Listening for Protocol Events

You can hook into the raw state machine for custom UI behaviors:

```javascript
sogni.apiClient.on('connected', () => {
  showConnectedToast('Live connection established to the Supernet.');
});

sogni.apiClient.on('disconnected', ({ reason, code }) => {
  console.warn(`Connection lost. Code: ${code}. Reason: ${reason}`);
});
```

---

**Next Volume**: [Vol. 14: Cross-Tab Synchronization](./VOL_14_TAB_SYNC.md)
