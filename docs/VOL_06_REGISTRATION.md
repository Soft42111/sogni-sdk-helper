# 🆕 Vol. 06: Direct Registration: Turnstile & Account Lifecycle

One of the most powerful features of the Sogni SDK is the ability to facilitate direct, programmatic user registration. This allows developers to build white-label AI studios where the account creation process is a seamless part of the application flow.

---

## 🔒 The Registration Pipeline

Unlike traditional "Sign Up" buttons that redirect to a third-party site, Sogni supports a direct registration API. However, because this endpoint is public, it is protected by a multi-layered security stack.

### 1. Cloudflare Turnstile Integration
To prevent automated "bot" accounts from draining free trial resources or spamming the network, Sogni requires a **Cloudflare Turnstile** token for every registration.

- **Developer Setup**: You must register your site on Cloudflare and obtain a `siteKey`.
- **User Flow**: The user solves a non-intrusive Turnstile widget in your UI.
- **SDK Handover**: Your frontend captures the resulting `turnstileToken` and passes it to the `register` method.

### 2. Method Signature
```javascript
const result = await sogni.account.register({
  username: 'unique_explorer_99',
  email: 'user@example.com',
  password: 'strong_password_123',
  turnstileToken: 'XXXX.YYYY.ZZZZ' // Captured from CF widget
});
```

---

## 🏗️ Account Initialization Logic

When `sogni.account.register()` is called, the Supernet performs several background actions:

### 1. Wallet Generation
Every Sogni account is natively tied to a **Base (L2)** blockchain wallet. 
- During registration, a unique public/private keypair is generated for the user.
- The public address is associated with the Sogni username. 
- This wallet is the "vault" where the user's earned $SOGNI or purchased $SPARK tokens are tracked.

### 2. Email Verification
The Supernet sends a verification link to the provided email address. 
- **Grace Period**: Users may have a small window to use the service before verification, but certain premium features (like high-concurrency video) require a verified status.

---

## 🔑 Session Persistence

Once registered, the user is automatically logged in. The SDK handles session persistence differently based on the environment:

- **Browser**: Uses `localStorage` or `cookies` (if configured) to store a transient session token.
- **Node.js**: The session is ephemeral by default. If building a persistent CLI tool, you must explicitly store the returned token and pass it as a `cookie` or `authHeader` in subsequent instances.

---

## ⚠️ Registration Error Handling

| Code | State | Resolution |
|------|-------|------------|
| `409` | **Conflict** | The username or email is already taken. |
| `400` | **Invalid Token** | The Turnstile token has expired or is invalid. |
| `422` | **Weak Password** | The password does not meet the complexity requirements. |

---

**Next Volume**: [Vol. 07: Wallet Architecture](./VOL_07_WALLET.md)
