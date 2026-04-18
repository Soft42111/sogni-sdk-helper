# 🌌 Sogni SDK AI Helper

A premium, production-ready AI Studio interface powered by the **[Sogni Supernet](https://sogni.ai)**. This application acts as a fully-featured standalone frontend, specifically engineered to interface directly with decentralized GPU workers.

Designed as an advanced technical companion for Sogni developers, it boasts a ChatGPT-style layout, stable bulk-sync architecture, dynamic AI chat titling, and seamless identity management.

This project is an independent sub-branch created by **Basit**, a developer in the Sogni ecosystem. It showcases advanced SDK capabilities and provides an elegant, highly functional wrapper around the `@sogni-ai/sogni-client`.

---

## ✨ Core Features

### 1. Robust Sogni SDK Integration
- **Stable Bulk Sync**: Uses non-streaming HTTP fetches perfectly tailored for Sogni nodes, guaranteeing flawless token assembly without `ReferenceError` crashes or out-of-order frame delivery.
- **Qwen 3.5 Native Integration**: Designed around the massive 128k context-window `qwen3.5` models, extracting `<think>` tags internally for advanced Chain-of-Thought AI reasoning.

### 2. Intelligent Chat Management
- **Conditional Auto-Titling**: Automatically generates a 2-4 word Title directly from the Context using a background, invisible API call *after* the initial user/AI interaction.
- **Manual Overrides**: Includes robust naming and renaming capabilities right from the Sidebar UI using modern CSS popovers and transitions.
- **Persistent Sessions**: Powered by synchronized local-storage caching so you never lose a brainstorming session.

### 3. Secure Auth Pipeline
- **Direct App Signups**: Built-in support for direct user on-boarding using `sogni.account.create`.
- **Cloudflare Turnstile Verification**: Anti-bot integration pre-configured for safe token generation.
- **Multi-Auth Flow**: Switch effortlessly between logging in via Decentralized Wallet Identity or stateless **API Key** authentication.

### 4. Dynamic Identity Context (`soul.md`)
- The assistant's persona is uncoupled from the codebase.
- The React application dynamically injects `src/soul.md` into the system prompt at runtime using Vite's `?raw` loader. 
- You can directly edit the robot's identity, behavior, and backstory just by editing the markdown file!

---

## 🏗️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **API Engine**: `@sogni-ai/sogni-client`
- **Styling**: Highly semantic vanilla CSS with CSS Variables (`var(--color-...)`) for instant light/dark mode toggling.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Security**: Cloudflare Turnstile

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0+ (Required for native `fetch` and optimal Vite HMR)
- **Sogni Account**: An active API Key or Account on the Sogni Supernet.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Soft42111/sogni-sdk-helper.git
   cd sogni-sdk-helper
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   *Note: This will also install the necessary `@sogni-ai/sogni-client` and `raw-loader`.*

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Studio**
   Open your browser to `http://localhost:5173`.

---

## 🛠️ Architecture & Routing

### Local Persistence
All chats and authentications are maintained via `localStorage`. The application runs entirely client-side. The standard startup sequence automatically attempts to hydrate the active Sogni Session from cache so users skip the login screen on return visits.

### CORS Security
To bypass standard web limitations, the application contains a native `fetch` overwrite proxy for Sogni APIs. This ensures perfect communication with decentralized nodes without requiring a localized server backend.

---

## 📜 Authors & Acknowledgments

- Created and maintained by **Basit**.
- Powered by the Sogni Supernet Ecosystem.

> **Disclaimer**: This is a community-driven project and is **not an official Sogni product**. It serves as an advanced blueprint and fully functional workstation for developers exploring decentralized AI.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
