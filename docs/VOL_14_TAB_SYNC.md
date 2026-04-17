# 👯 Vol. 14: Cross-Tab Synchronization: The Leader-Follower Pattern

For modern web applications, it is common for a user to have multiple tabs of the same application open. Opening a unique WebSocket connection for every tab is inefficient and can lead to account-level session conflicts. The Sogni SDK solves this through an automated **Cross-Tab Synchronization** mechanism.

---

## 🏛️ The Leader-Follower Architecture

When the Sogni SDK initializes in a browser, it uses the `BroadcastChannel` and `LocalStorage` APIs to negotiate "Leadership" among all open tabs.

### 1. The Leader Tab
The first tab to initialize becomes the **Leader**.
- **Responsibilities**: Maintains the single primary WebSocket connection to the Supernet.
- **Data Flow**: Receives all project updates, progress percentages, and results. It "broadcasts" these updates to all other tabs on a local channel.

### 2. The Follower Tabs
Any subsequent tab opened becomes a **Follower**.
- **Responsibilities**: Listens to the local broadcast channel instead of opening a WebSocket.
- **Data Flow**: When you call `sogni.projects.create()` in a Follower tab, the request is sent to the Leader tab via the broadcast channel. The Leader then sends the request over its WebSocket.

---

## 🔄 Dynamic Election (Handover)

What happens if the user closes the Leader tab?
1.  **Detection**: The Follower tabs detect the Leader's "Heartbeat" (local) has stopped.
2.  **Election**: The remaining tabs hold a race to become the new Leader.
3.  **Restoration**: The new Leader immediately opens a WebSocket and resumes all active project tracking from the previous session.

This transition is seamless and typically invisible to the end user.

---

## 🛠️ Developer Prerequisites

For Cross-Tab Sync to function correctly, your application must meet certain environment requirements:

### 1. Same-Origin Policy
All tabs must be on the same domain and protocol (e.g., `https://myapp.com`). Secure contexts (`https`) are required for the `BroadcastChannel` API.

### 2. Persistence of `appId`
Ensure that the `appId` remains identical across tabs. If Tab A uses `app-1` and Tab B uses `app-2`, they will be treated as separate applications and will both open WebSockets, potentially leading to cross-talk.

---

## 🎨 Coordinating UI State

The SDK ensures that if a video is generating in Tab A, the progress bar in Tab B will update in perfect unison. 

### Manual Sync (Optional)
If you have custom state (e.g., a "Generation History" array) that is not part of the Sogni SDK's internal entities, you should use a global state manager (like Redux or Zustand) with a persistence middleware to keep your custom data in sync alongside the SDK.

---

## 🛑 Disabling Synchronization

If you are building a specialized multi-user environment where tabs *must* be isolated, you can disable this behavior during initialization:

```javascript
const sogni = await SogniClient.createInstance({
  appId: 'unique-instance-id',
  syncOptions: {
    enabled: false // Disables Cross-Tab Sync / Leader Election
  }
});
```

---

**Next Volume**: [Vol. 15: Auto-Reconnect Logic](./VOL_15_RECONNECT.md)
