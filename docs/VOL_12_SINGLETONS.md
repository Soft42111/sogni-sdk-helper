# 🏗️ Vol. 12: Singleton Patterns: SDK Lifecycle Management

Managing the lifecycle of the Sogni SDK instance is critical for maintaining a stable WebSocket connection and preventing redundant token usage. This volume explores the "Singleton" pattern and why it is the state-of-the-art approach for Sogni integration.

---

## 🏛️ The Problem of Multi-Instantiation

When you call `SogniClient.createInstance()`, the SDK initializes a complex orchestration of WebSocket streams, event listeners, and local state management.

### Risks of Multiple Instances:
1.  **WebSocket Overload**: Each instance opens its own connection. In a shared network environment, this can lead to port exhaustion or account-level rate limits.
2.  **State Desync**: Project progress from Instance A might not be reflected in Instance B's UI.
3.  **Token Leakage**: Certain authentication tokens are scoped to a specific connection. Multiple connections can trigger "Session Conflict" errors from the Supernet.

---

## 🧩 The Global Singleton Pattern

The recommended pattern is to initialize the SDK once and export that single instance throughout your entire application.

### Implementation (JavaScript/ESM)
```javascript
// sogniClient.js
import { SogniClient } from '@sogni-ai/sogni-client';

let instance = null;

export const getSogni = async (config) => {
  if (!instance) {
    instance = await SogniClient.createInstance(config);
  }
  return instance;
};
```

---

## ⚛️ Framework Integration (React Context)

If building a React application, the "Provider" pattern is the most robust way to distribute the singleton.

```javascript
// SogniProvider.jsx
const SogniContext = createContext(null);

export function SogniProvider({ children }) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    SogniClient.createInstance({ appId: 'my-app' }).then(setClient);
  }, []);

  return (
    <SogniContext.Provider value={client}>
      {client ? children : <LoadingOverlay />}
    </SogniContext.Provider>
  );
}
```

---

## 🛡️ Instance Persistence in Node.js

In a server environment, the Sogni instance should reside in the highest level of your application state (the global scope) to ensure the connection stays warm across multiple REST API or WebSocket requests from your users.

### "Warm Boot" Strategy
Initialize the client during your server's startup phase—before you start listening for HTTP requests. This ensures that the first user to request an image doesn't face the initial 2-second connection handshake.

```javascript
// server.js
import { getSogni } from './sogniClient.js';

const startServer = async () => {
  await getSogni({ apiKey: process.env.SOGNI_KEY });
  app.listen(3000, () => console.log('Ready. Connection warm.'));
};
```

---

## 🛑 Proper Teardown

In development (especially with Hot Module Replacement / HMR), you may accidentally create hundreds of instances. Always implement a cleanup logic that calls `sogni.apiClient.disconnect()` if the application is unmounting or restarting.

---

**Next Volume**: [Vol. 13: WebSocket State Machine](./VOL_13_WS_STATE.md)
