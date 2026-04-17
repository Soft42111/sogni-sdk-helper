# 🚀 Getting Started: Onboarding & Authentication

This guide covers the essential steps to initialize the Sogni SDK, manage your decentralized account, and navigate the dual-token economy of the Sogni Supernet.

---

## 📦 Installation

The Sogni SDK is a unified library for both Node.js and Browser environments. There is no need for separate packages.

```bash
# Using npm
npm install @sogni-ai/sogni-client

# Using yarn
yarn add @sogni-ai/sogni-client
```

### Environment Requirements
- **Node.js**: v18.0.0 or higher is required for native `fetch` and modern WebSocket support.
- **Browsers**: Any modern evergreen browser (Chrome, Edge, Safari, Firefox).
- **TypeScript**: The package includes built-in types. No `@types` install is necessary.

---

## 🔑 Authentication & Account Lifecycle

Sogni offers three ways to interact with the Supernet: absolute anonymity (via API Keys), traditional user authentication (Login), and programmatic account creation (Direct Signup).

---

## 🆕 Direct Account Registration (Signup)

The Sogni SDK allows you to register new users directly within your application. This is ideal for building "Self-Sovereign" AI tools where each user manages their own decentralized balance and identity.

### Anti-Bot Requirement: Cloudflare Turnstile
To prevent automated abuse of the Supernet, the `register` method requires a valid **Cloudflare Turnstile** token. Your frontend must implement a Turnstile widget and pass the resulting token to the SDK.

### Implementation Pattern

```javascript
// 1. Initialize the client (unauthenticated)
const sogni = await SogniClient.createInstance({ appId: 'my-app-id' });

// 2. Perform direct registration
try {
  const result = await sogni.account.register({
    username: 'new_explorer_2026',
    email: 'user@example.com',
    password: 'secure_password_123',
    turnstileToken: 'XXXX.YYYY.ZZZZ' // Obtained from your frontend widget
  });

  console.log('Account Created:', result.username);
  console.log('Base Wallet Address:', result.walletAddress);

  // Success: The user is now registered and automatically logged in.
} catch (error) {
  if (error.code === 409) console.error('Username or email already exists.');
  if (error.code === 400) console.error('Invalid Turnstile token or weak password.');
}
```

---

## 🚪 Authentication Strategies

### 1. API Key Authentication (Highly Recommended)
This is the modern standard for AI development and automated agents. It is stateless and allows for "Plug-and-Play" initialization.

**Best for**: Backend servers, CLI tools, and development.

```javascript
import { SogniClient } from '@sogni-ai/sogni-client';

const sogni = await SogniClient.createInstance({
  appId: 'my-app-unique-id', // Use a unique UUID string
  apiKey: 'YOUR_SOGNI_API_KEY',
  network: 'fast' // Default network for this instance
});

// SUCCESS: The client is now connected and authenticated.
```

### 2. Username & Password Authentication
This method is used when building applications where users provide their own Sogni credentials.

**Best for**: Browser-based "Studio" applications or Wallets.

```javascript
const sogni = await SogniClient.createInstance({ 
  appId: 'my-app-unique-id' 
});

// Explicit login call required
await sogni.account.login('jane_doe', 'my_secure_password');
```

---

## 💰 The Dual-Token Economy

To perform inference on the Sogni Supernet, your account must have a positive focus on one of two token types.

### 1. $SPARK Tokens (Mainstream)
Spark tokens are the "Stable" entry point for Sogni. 
- **Acquisition**: Can be purchased via traditional payment methods (Credit Card, Apple Pay).
- **Usage**: Used for all standard rendering and chat tasks.
- **Benefit**: Predictable pricing without cryptocurrency exposure.

### 2. $SOGNI Tokens (Native Utility)
The native ERC-20 token on the **Base (Layer 2)** blockchain.
- **Acquisition**: Earned by provides GPU power (Workers) or purchased on decentralized exchanges.
- **Usage**: The primary utility token for the decentralized network.
- **Benefit**: Decentralized governance and ecosystem rewards.

### Checking Balances
The SDK provides real-time access to your token balances:
```javascript
const user = await sogni.account.me();
console.log('Spark Balance:', user.balance.spark);
console.log('SOGNI Balance:', user.balance.sogni);
```

---

## 🌐 The Network Selector: Fast vs. Relaxed

The cost and speed of your tasks are determined by which network tier you select.

| Feature | Fast Network (`'fast'`) | Relaxed Network (`'relaxed'`) |
|---------|-------------------------|-------------------------------|
| **Hardware** | NVIDIA high-end GPUs | Apple Silicon (Macs) |
| **Speed** | Instant / High Performance | Deferred / Cost-Efficient |
| **Cost** | Premium | Economical |
| **Video** | ✅ Required | ❌ Unsupported |
| **Image** | ✅ Supported | ✅ Supported |
| **LLM** | ✅ Supported | ✅ Supported |

> [!TIP]
> Always initialize with `network: 'fast'` if you intend to generate Video or use "Turbo" models. You can override this per-project later.

---

## 🛡️ Security Best Practices

1. **Keep Secrets Secret**: Never commit your `apiKey` to a public repository. Use `.env` files.
2. **App ID Uniqueness**: Use a unique `appId` for every application you build. The Supernet uses this to manage rate limits and session persistence.
3. **Wallet Association**: Remember that every Sogni account is tied to a **Base Wallet**. Your $SOGNI tokens reside on the blockchain. Treat your credentials as you would a hardware wallet seed.

---

**Next Step**: [03_IMAGE_SYNTHESIS_MASTER_CLASS.md](./03_IMAGE_SYNTHESIS_MASTER_CLASS.md)
