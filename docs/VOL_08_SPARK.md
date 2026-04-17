# ⚡ Vol. 08: The $SPARK Economy: The Mainstream Utility Model

While Sogni is built on blockchain foundations, the **$SPARK** token is designed to provide a mainstream "SaaS-like" experience for developers and users. This volume explores how Spark acts as the primary fuel for the Sogni Supernet.

---

## 💎 What is Spark?

Spark is a localized, non-transferable credit within the Sogni ecosystem. It is the "Off-Chain" equivalent of SOGNI, designed for stability and ease of acquisition.

### Key Characteristics:
1.  **Fixed Value**: Unlike SOGNI (which fluctuates on the open market), Spark has a predictable value relative to fiat currency (USD).
2.  **Ease of Purchase**: It can be acquired via standard fiat payment methods and integrated digital processors through the Sogni app/dashboard.
3.  **Non-Transferable**: Spark remains tied to the account that purchased it. It cannot be sent between wallets like $SOGNI.

---

## ⚡ Spark Tiers

Not all Spark is created equal. The Supernet differentiates between tokens based on their acquisition source.

### 1. Paid Spark
Tokens purchased via fiat.
- **Priority**: Highest priority in the worker queue.
- **Access**: Unrestricted access to all "Fast" network models (including cinematic video).

### 2. Free Spark (Rewards/Trials)
Tokens given to new users or earned through platform participation.
- **Restrictions**: Some high-end "Professional" models may be restricted for use with Free Spark to prevent abuse and ensure high-paying jobs are processed first.
- **Queue Priority**: Lower than Paid Spark.

---

## 📊 Spending Spark

The SDK allows you to track exactly how much Spark is consumed per project.

### Automatic Billing
When a project is created, the Orchestrator calculates the **Inferred Cost** based on:
- Model choice.
- Number of steps.
- Resolution.
- Duration (for video).

```javascript
// Calculate cost before starting (Manual Estimation)
const cost = await sogni.projects.estimateCost({
  type: 'video',
  modelId: 'wan_v2.2-14b-fp8_t2v_lightx2v',
  duration: 5
});

console.log('Estimated Spark Cost:', cost.spark);
```

---

## 📉 Low Balance Protection

If a user's Spark balance drops below the required amount for a specific project, the SDK will throw an immediate error during creation.

| Error Code | Meaning |
|------------|---------|
| `402` | **Payment Required**: Insufficient Spark balance for this request. |
| `4054` | **Premium Required**: This model requires a paid Spark balance. |

---

## 🔄 Spark vs. $SOGNI

| Feature | $SPARK | $SOGNI |
|---------|--------|--------|
| **Format** | Internal Credit | ERC-20 Token (L2) |
| **Buy with** | Credit Card / Fiat | Crypto Exchange |
| **Transferable**| ❌ No | ✅ Yes |
| **Staking** | ❌ No | ✅ Yes |
| **Usage** | Inference Only | Governance / Reward / Inference |

---

**Next Volume**: [Vol. 09: $SOGNI Staking](./VOL_09_SOGNI_STAKING.md)
