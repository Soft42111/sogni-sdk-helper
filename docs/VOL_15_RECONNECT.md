# ⚡ Vol. 15: Auto-Reconnect Logic & Backoff Strategies

Network stability is not guaranteed in a decentralized system. The Sogni SDK is engineered to handle intermittent connectivity, firewall interference, and server-side restarts without losing user data or project tracking. This volume explains the mechanics of the Sogni **Reconnect Engine**.

---

## 🏛️ The Reconnect Trigger

The SDK triggers a reconnection attempt when:
1.  **State Machine Detection**: The WebSocket emits an `error` or `close` event.
2.  **Heartbeat Timeout**: Three consecutive Pings go un-Ponged (see [Vol. 13](./VOL_13_WS_STATE.md)).
3.  **OS Sleep/Resume**: The browser detects that the computer has woken up from sleep mode.

---

## 📈 Logarithmic Exponential Backoff

To prevent "Thundering Herd" scenarios—where thousands of disconnected clients simultaneously hammer the Supernet gateway—the SDK implements a sophisticated backoff strategy.

### The Backoff Formula
Wait Time = **`min(Cap, (Initial_Wait * Base^Attempt_Number) + Random_Jitter)`**

- **Initial Wait**: 500ms.
- **Base**: 2.0 (The multiplier doubles the wait each time).
- **Cap**: 30,000ms (Max wait between attempts is 30 seconds).
- **Random Jitter**: Prevents clients from synchronizing their retries.

---

## 🔄 State Recovery (Resumption)

Reconnection is only half the battle. Once re-established, the SDK must recover its previous state.

### 1. The ID Handshake
Upon reconnection, the SDK sends its previous `sessionId` and `lastMessageId`.
### 2. The Delta Replay
The Supernet gateway checks its internal cache for any messages sent to that user while they were offline. If found, it "replays" the missed messages (e.g., job progress updates) in chronological order.
### 3. Entity Refresh
The SDK automatically calls `refreshProjectStates()` for all active projects to ensure the local UI state matches the ground truth on the Supernet.

---

## 🛡️ Circuit Breaking

If the SDK fails to reconnect after **10 consecutive attempts** (approximately 5 minutes of total retry time), it triggers the **Circuit Breaker**.
- **Action**: The SDK stops attempting auto-reconnect.
- **Event**: Emits a `connectionFailed` alert.
- **Resolution**: Requires manual site refresh or an explicit call to `sogni.apiClient.reconnect()`. This prevents the SDK from wasting user battery and network bandwidth on a fundamentally broken connection.

---

## 🛠️ Customizing Connectivity

Developers can tune the reconnect engine for specialized environments (e.g., extremely poor cellular networks):

```javascript
const sogni = await SogniClient.createInstance({
  reconnectOptions: {
    maxAttempts: 20,      // More persistent retries
    initialDelay: 1000,   // Start with 1s wait
    maxDelay: 60000       // Wait up to 1 minute between tries
  }
});
```

---

**Next Volume**: [Vol. 16: Browser Optimization](./VOL_16_OPTIMIZATION.md)
