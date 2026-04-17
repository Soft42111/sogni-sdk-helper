# 📕 Vol. 50: Error Encyclopedia: Status Code Deep Dive

Developing in a decentralized environment requires robust error handling. This volume provides a comprehensive catalog of the status codes used by the Sogni Supernet and advice on how to handle them gracefully in your application.

---

## 🏛️ 4xx: Client-Side Errors

These errors indicate an issue with the request sent by the SDK.

### `400` - Bad Request
- **Cause**: Invalid parameters (e.g., negative duration, invalid resolution).
- **Handling**: Validate your input against the project schema before calling the SDK.

### `401` - Unauthorized
- **Cause**: Missing or invalid `apiKey` or `sessionToken`.
- **Handling**: Trigger a login flow or prompt the user to check their API key.

### `402` - Payment Required
- **Cause**: Insufficient **Spark** or **SOGNI** balance for the requested project.
- **Handling**: Display a "Top Up" modal or guide the user to the Sogni deposit page.

### `403` - Forbidden (Safety Filter)
- **Cause**: The prompt or the generated content triggered the **Safety Filtration Protocol** (NSFW).
- **Handling**: Inform the user their prompt contains restricted content. Do not retry the same prompt.

---

## 🏛️ 5xx: Supernet & Worker Errors

These errors indicate an issue within the decentralized network.

### `500` - Internal Server Error (Orchestrator)
- **Cause**: A generic crash in the Sogni gateway.
- **Handling**: Implement a retry with an exponential backoff (Vol. 15).

### `502` - Bad Gateway (Worker Offline)
- **Cause**: The specific worker node assigned to your job disconnected before finishing.
- **Handling**: The Sogni Orchestrator usually handles this automatically by re-dispatching (Vol. 04), but if the SDK receives this, you should re-create the project.

### `504` - Gateway Timeout
- **Cause**: A job took too long to complete (common with large contexts or high-step videos on slow workers).
- **Handling**: Check if the `network` is set to `fast`. Consider reducing the `steps` or `duration`.

---

## 🏛️ Specialized Sogni Error Codes

Sogni uses a custom range of codes for decentralized-specific scenarios.

| Code | Label | Resolution |
|------|-------|------------|
| `4054`| **Premium Required** | Upgrade to a paid account to use this high-end model. |
| `4300`| **Model Not Found** | The specified `modelId` is not currently active on any workers. |
| `4410`| **Turnstile Failure** | Registration failed due to an invalid anti-bot token. |
| `5100`| **Consensus Failure** | Multi-worker verification failed. The job was rejected for security. |

---

## 🛠️ Global Error Interception

Always wrap your SDK calls in a `try/catch` block or listen for the `error` event on the client.

```javascript
sogni.apiClient.on('error', (err) => {
  if (err.code === 402) showBillingAlert();
  if (err.code === 403) showSafetyAlert();
  if (err.code >= 500) triggerAutoRetry();
});
```

---

**Next Volume**: [Vol. 51: Circuit Breaking Patterns](./VOL_51_CIRCUIT_BREAKER.md)
