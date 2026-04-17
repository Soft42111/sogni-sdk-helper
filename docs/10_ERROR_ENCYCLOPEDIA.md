# 🆘 Error Encyclopedia: Resilience & Fault Tolerance

In a decentralized network like the Sogni Supernet, resilience is a primary engineering concern. This document catalogs every possible error state and provides a definitive guide on how to handle them gracefully within your application.

---

## 🏛️ Error Structure

Every error returned by the Sogni SDK includes a numerical `code` and a human-readable `message`.

```javascript
try {
  await project.waitForCompletion();
} catch (error) {
  console.log('Error Code:', error.code);
  console.log('Error Message:', error.message);
  console.log('Trace ID:', error.traceId); // Use this for technical support
}
```

---

## 🔑 Critical Error Codes

### 1. Account & Balance Errors
| Code | Message | Resolution |
|------|---------|------------|
| `402` | **Insufficient Credits** | Prompt the user to top up their Spark or SOGNI balance. |
| `4053`| **Free Spark Restricted** | The requested model is premium. User must use a paid Spark balance. |
| `4054`| **Premium Spark Required**| The requested model requires premium-tier tokens. |
| `401` | **Unauthorized** | Re-initialize the SDK with a valid `apiKey`. |

### 2. Rate & Concurrency Limits
| Code | Message | Resolution |
|------|---------|------------|
| `429` | **Too Many Requests** | The Supernet is rate-limiting your `appId`. Implement exponential backoff (wait 30s-60s). |
| `4005`| **Concurrent Job Limit**| Your account has too many active jobs. Wait for one to finish before starting another. |

### 3. Network & Infrastructure
| Code | Message | Resolution |
|------|---------|------------|
| `500` | **Supernet Node Error**| A decentralized worker failed. **Retry Strategy**: The SDK often handles this, but you should retry once on the `fast` network. |
| `503` | **Network Unavailable** | The Supernet orchestrator is temporarily down. Check [status.sogni.ai](https://status.sogni.ai). |

### 4. Validation & Safety
| Code | Message | Resolution |
|------|---------|------------|
| `400` | **Validation Failed** | Check your parameters (e.g., dimensions not divisible by 16 for WAN). |
| `NSFW` | **Content Filtered** | (Special State) The worker detected NSFW content and blocked the upload. The job will mark as `completed: true` but `imageUrls` will be empty. |

---

## 🛡️ Implementing a Robust Retry Strategy

Because Sogni is decentralized, a "Job Failure" often just means a specific individual worker had an issue. It does **not** mean the model is broken.

### Recommended Logic:
1. **Catch Error**: Detect code `500` or `timeout`.
2. **Exponential Backoff**: Wait `2^retryCount * 500ms`.
3. **Switch Network**: If the first attempt was on `relaxed`, force the retry onto the `fast` network for a guarantee of higher-end hardware.
4. **Max Retries**: Stop after 3 attempts and notify the user.

---

## 🛑 NSFW Filtration Handling

Sogni implements strict safety protocols. If a user's prompt or generation is flagged as NSFW:
- The SDK does **not** throw an error (to prevent breaking loops).
- The `Project` will signal `completed`.
- The `Job.resultUrl` will be `null` or an empty string.
- Your UI should detect this and display a "Content filtered for safety" message rather than showing a broken image link.

```javascript
if (job.completed && !job.resultUrl) {
  showSafetyToast("Your result was filtered according to our safety guidelines.");
}
```

---

## 📞 Reporting Issues

If you encounter an error not listed here, please include your **`traceId`** in a support ticket at [github.com/Sogni-AI/sogni-client/issues](https://github.com/Sogni-AI/sogni-client/issues).

---

**Next Step**: [README.md (Index)](./README.md)
