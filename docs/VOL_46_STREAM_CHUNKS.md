# 🌊 Vol. 46: Chunk Delivery Delta: Merging & Streaming

The Sogni Supernet is a high-performance streaming environment. To provide a "Zero-Lag" user experience, the SDK utilizes a **Delta-Based Chunk Delivery** system. This volume explains how tokens and reasoning blocks are merged in real-time.

---

## 🏛️ Why Delta Streaming?

Traditional HTTP requests return the entire body at once. For AI generation, waiting for a 128K context response can take minutes.
- **The Stream**: Sogni starts sending the response as soon as the first token is generated.
- **The Delta**: Instead of sending the full string repeatedly, the server only sends the "Change" (the delta).

---

## 🏗️ The Stream Frame Anatomy

A typical streaming frame from the Sogni Supernet contains:
1.  **`id`**: Unique identifier for the chat completion.
2.  **`object`**: Always `chat.completion.chunk`.
3.  **`choices`**: An array containing the `delta` object.
    - **`content`**: The actual new text tokens.
    - **`reasoning`**: The internal thinking tokens (Vol. 45).
4.  **`finish_reason`**: Set once the generation is complete (`stop`, `length`, or `tool_calls`).

---

## 🛠️ Efficient Stream Merging in the SDK

The Sogni SDK handles the complex task of merging these deltas into a coherent string for your UI. 

### Manual Merging (If not using the SDK's helper class):
```javascript
let fullContent = "";
let fullReasoning = "";

for await (const chunk of stream) {
  const delta = chunk.choices[0].delta;
  
  if (delta.content) {
    fullContent += delta.content;
    updateChatUI(fullContent); // Append to the chat box
  }
  
  if (delta.reasoning) {
    fullReasoning += delta.reasoning;
    updateThinkingUI(fullReasoning); // Append to the collapsible reasoning box
  }
}
```

---

## ⚡ Handling Out-of-Order Frames

In a decentralized network, packets can technically travel through different routes. 
- **The Sequence Number**: Every Sogni stream chunk includes a `seq` index.
- **The SDK Buffer**: The Sogni SDK maintains an internal buffer. If it receives `seq: 10` before `seq: 9`, it waits for `seq: 9` and then delivers them in the correct order. This ensures your UI never displays gibberish or duplicated text.

---

## 📐 Latency Optimization: The "Prefill" Threshold

While streaming is fast, there is an initial "Prefill" delay as the model processes your system instructions and context.
- **Sogni Advantage**: By enabling **TeaCache** (Vol. 48) and utilizing the **Fast Network**, Sogni minimizes this delay, targeting a **TTFT (Time to First Token)** of under 800ms for standard conversations.

---

## 🧪 Browser-Side Rendering Tips

- **Don't Re-render the Entire Chat**: When a new chunk arrives, only append the data to your state. 
- **Auto-Scroll Hygiene**: If the user has scrolled up to read previous messages, **do not** force-scroll them back to the bottom when new chunks arrive. This is a common UX failure in AI applications.

---

**Next Volume**: [Vol. 47: Tool-Calling Schemas](./VOL_47_TOOL_SCHEMAS.md)
