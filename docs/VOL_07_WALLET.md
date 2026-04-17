# 🏦 Vol. 07: Wallet Architecture: Base L2 Integration

The Sogni Supernet is deeply integrated with the **Base (Layer 2)** blockchain. This volume explores the relationship between your Sogni account and its associated wallet, and how this architecture enables decentralized finance (DeFi) within the AI ecosystem.

---

## 🏗️ The Hybrid Identity Model

Every Sogni user possesses a hybrid identity:
1.  **Application Identity**: A traditional username, email, and password managed by the Sogni Ordinator.
2.  **Blockchain Identity**: A unique public address on the Base network.

### Why use Base (L2)?
Sogni utilizes Base for its blockchain operations because it offers:
- **Low Gas Fees**: Transactions (like token transfers or rewards) cost fractions of a cent.
- **Etherum Security**: Settlement is secured by the Ethereum Mainnet.
- **Speed**: Near-instant confirmation times required for real-time AI economies.

---

## 🛡️ Wallet Ownership & "Self-Sovereignty"

When an account is created via the SDK, a wallet is automatically associated with it.

### 1. The Managed Wallet
By default, the Sogni Supernet manages the wallet's keys on behalf of the user (CUSTODIAL). This allows mainstream users to earn rewards and buy tokens without managing private keys.

### 2. Exporting to Self-Custody
Advanced users can "Export" their wallet. This provides the user with the private key or seed phrase, allowing them to import the wallet into external Web3 tools.
- **Important**: Once exported, Sogni can no longer recover the wallet if the key is lost. Standard Web3 wallet applications can be used to manage these exported keys.

---

## 💰 On-Chain Operations

The following operations happen directly on the Base blockchain and can be monitored via block explorers (like basescan.org).

### $SOGNI Token Utility
$SOGNI is the native ERC-20 token of the Supernet.
- **Rewards**: If you are a Worker, your earnings are deposited directly into your Base wallet.
- **Transfers**: You can send $SOGNI from your SDK instance to any other wallet on the Base network.

```javascript
// Transferring SOGNI tokens via the SDK
const transfer = await sogni.account.transfer({
  to: '0x123...abc', // Recipient's Base address
  amount: 1000,       // Amount in SOGNI
  tokenType: 'sogni'
});
```

---

## 🌉 Bridging & Liquidity

Since Sogni operates on Base (L2), users coming from Ethereum (L1) or other chains must "Bridge" their assets. 
- The Sogni website and app provide integrated bridging tools.
- Once bridged to Base, your tokens are instantly available for use within the SDK.

---

## 📐 Wallet Addressing for Developers

When building applications, you can always retrieve the user's public address to display or verify on-chain activity.

```javascript
const me = await sogni.account.me();
console.log('Public Base Address:', me.walletAddress);
```

---

**Next Volume**: [Vol. 08: $SPARK Economy](./VOL_08_SPARK.md)
