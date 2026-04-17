# 🔐 Vol. 11: Security & Encryption: Securing the Inference Chain

Protecting intellectual property, user privacy, and network integrity are the three cornerstones of the Sogni Supernet's security architecture. This volume provides a technical breakdown of how data is secured from the initial prompt to the final rendered media.

---

## 🛰️ Transport Layer Security (TLS)

All communication between the SDK and the Supernet Orchestration Nodes is encrypted using **TLS 1.3**. 
- Even if a centralized ISP attempts to intercept the WebSocket traffic, they will only see an encrypted stream. 
- The identity of the specific models you are calling and the content of your prompts are shielded from network-level eavesdropping.

---

## 🎨 Zero-Leak Result Encryption

One of the most innovative features of Sogni is the **Encrypted Output Pipeline**. 

### The Process:
1.  **Worker Isolation**: The decentralized worker performs the inference in a sandboxed environment.
2.  **On-Device Encryption**: As soon as the rendering is complete, the worker's CPU/GPU encrypts the buffer using an AES-256-GCM symmetric key generated for that specific job.
3.  **Encrypted Upload**: The resulting ciphertext is uploaded to the Sogni storage network.
4.  **SDK Decryption**: The SDK receives the key via the secure persistent WebSocket and decrypts the media directly in the user's browser or Node.js environment.

---

## 🕒 Transient URL Security

Sogni generates **Time-Limited Signed URLs** for all completed assets.
- **Validity**: By default, URLs are valid for **24 hours**. 
- **Privacy**: These URLs are unguessable and require specific request signatures to access.
- **Developer Responsibility**: If your application requires permanent storage (e.g., a user's gallery), you must download the asset and store it on your own server or cloud storage before the 24-hour expiry.

---

## 🔑 Authentication Security

### 1. API Key Protections
API keys are never shared with workers. They are only used to authenticate your session with the Supernet Orchestrator. The orchestrator acts as a "Trust Proxy," ensuring workers only receive the anonymized job data.

### 2. Wallet Signature Logic
For sensitive on-chain operations (like $SOGNI transfers), the SDK uses a **Local Signing** pattern. The private key never leaves the client's memory. Instead, the transaction is signed locally and the resulting signed hash is broadcast to the Base network.

---

## 🛡️ Anti-Bot & Fraud Protection

As detailed in [Vol. 06](./VOL_06_REGISTRATION.md), the system uses **Cloudflare Turnstile** for account registration. 
- This prevents "Sybil Attacks," where a malicious actor creates thousands of accounts to exploit free trial tiers or manipulate the reputation scores of decentralized workers.

---

## ⚠️ Summary of Best Practices
- **Hide API Keys**: Never expose your key in an un-obfuscated frontend `index.html`.
- **Use COOP/COEP**: Mandatory for secure SharedArrayBuffer usage in production.
- **Monitor Trace IDs**: In case of a security audit, always provide the `traceId` which contains the audit trail for the inference chain.

---

**Next Volume**: [Vol. 12: Singleton Patterns](./VOL_12_SINGLETONS.md)
