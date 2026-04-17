# 🛡️ Vol. 51: Circuit Breaking & Resilience Patterns

In a decentralized infrastructure like the Sogni Supernet, resilience is a primary architectural requirement. **Circuit Breaking** is the ultimate pattern for ensuring that your application remains responsive even during localized network failures or worker congestion. This volume explores how to implement these patterns using the Sogni SDK.

---

## 🏛️ What is a Circuit Breaker?

The Circuit Breaker pattern prevents an application from repeatedly trying an operation that is likely to fail.
1.  **Closed (Healthy)**: Requests flow normally to the Supernet.
2.  **Open (Short-Circuit)**: If a threshold of errors is reached (e.g., 5 sequential `502 Bad Gateway` errors), the circuit "opens." Subsequent requests are failed immediately by the SDK without even hitting the network.
3.  **Half-Open (Testing)**: After a "Sleep Window," the SDK allows a single request through. If it succeeds, the circuit closes again.

---

## 🛠️ The SDK's Internal Circuit Breaker

The Sogni SDK implements an automated circuit breaker at the WebSocket layer. 
- **Auto-Protection**: If the SDK fails to reconnect 10 times (see [Vol. 15](./VOL_15_RECONNECT.md)), it "opens" the circuit and stops all background connection attempts.
- **Event Notification**: The SDK will emit a `circuit_open` event, allowing you to update your UI (e.g., "Sogni is currently unavailable, trying again in 5 minutes").

---

## 🧬 Implementing Application-Level Resilience

Beyond the SDK's internal logic, you should implement your own circuit breakers for specific modalities.

### Example: Video Generation Fallback
If the **Fast Network** is experiencing extreme congestion (high `504 Timeout` rates), your circuit breaker could automatically "Open" the video creation feature and fall back to "Image Generation" which might be more available on the **Relaxed Network**.

```javascript
import { CircuitBreaker } from 'your-resilience-lib';

const videoBreaker = new CircuitBreaker(generateVideo, {
  errorThresholdPercentage: 50,
  resetTimeout: 300000 // 5 minutes
});

videoBreaker.on('open', () => {
  notifyUser("High Supernet load. Switching to Image-only mode.");
  disableVideoBtn();
});
```

---

## 📐 Rate Limiting & "Graceful Degradation"

When your application is under high load or the Supernet is congested, use **Graceful Degradation**:
1.  **Reduce Resolution**: Switch from 1024px to 512px.
2.  **Reduce Steps**: Switch from 50 steps to 20 steps.
3.  **Reduce Frequency**: Limit users to one generation every 30 seconds.

These measures reduce the pressure on decentralized workers and increase the success rate of every individual job.

---

## ⚠️ Summary of Best Practices

- **Never Infinite Retry**: Always have a `maxAttempts` or a timeout for every project.
- **User Transparency**: Always tell the user *why* an operation is failing or being throttled.
- **Diversify Assets**: If the primary Supernet gateway is unreachable, your circuit breaker should be able to serve "Cached results" (Vol. 49) to maintain a feeling of responsiveness.

---

## 🏁 The End of the Technical Encyclopedia

This concludes the 52-volume **Sogni Technical Encyclopedia**. These documents provide the foundation for building the next generation of decentralized, multimodal AI applications.

**Master Index**: [README.md](./README.md)
