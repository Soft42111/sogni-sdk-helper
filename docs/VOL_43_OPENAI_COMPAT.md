# 🧠 Vol. 43: OpenAI Layer Mapping: The Compatibility Engine

The Sogni SDK provides a high-performance **OpenAI Compatibility Layer**. This allows developers to port existing LLM applications to the Sogni Supernet with minimal code changes, while still leveraging Sogni's unique decentralized capabilities. This volume explores how the mapping functions behind the scenes.

---

## 🏛️ The Translation Manifold

The Sogni Orchestrator acts as a "Bilingual Proxy." It accepts standard OpenAI-format JSON requests and translates them into the internal Sogni Protobuf protocol used by decentralized workers.

### Key Mapping Rules:
1.  **Endpoints**: Requests to `/v1/chat/completions` are routed to the Sogni Chat completion engine.
2.  **Model Mapping**: Generic model names like `gpt-4o` or `claude-3-5-sonnet` (if using Sogni's external routing) are mapped to the most capable local models such as **Qwen 3.5**.
3.  **Parameter Passthrough**: Parameters like `temperature`, `max_tokens`, `stop`, and `presence_penalty` are mapped 1-to-1 to the underlying model's inference engine.

---

## 🛠️ SDK Implementation

Using the OpenAI-compatible layer is the recommended way to handle text chat, as it integrates perfectly with existing toolsets like **LangChain**, **LlamaIndex**, and **Vercel AI SDK**.

```javascript
// Standard Sogni call using OpenAI-compatible structure
const response = await sogni.chat.completions.create({
  model: 'qwen3.5-35b-a3b-gguf-q4km', // Sogni-specific model ID
  messages: [
    { role: 'system', content: 'You are a technical documentation assistant.' },
    { role: 'user', content: 'Explain the Sogni Supernet.' }
  ],
  stream: true,
  temperature: 0.7
});
```

---

## ⚡ Beyond OpenAI: The Sogni Advantage

While the API format is compatible, Sogni adds several unique features that the standard OpenAI API lacks:

### 1. Decentralized Identity
Instead of a centralized API key belonging to a single corp, your requests are authenticated via your **Sogni App ID** and associated **Base Wallet** (Vol. 07). This ensures your usage is tied to your decentralized balance.

### 2. Multi-Model Concurrency
Because Sogni uses a Supernet of thousands of workers, you can trigger hundreds of simultaneous chat completions across different models (Qwen, Llama, Mistral) without hitting the restrictive "Rate Limits" common in centralized providers.

### 3. Native "Thinking" Mode
Sogni's mapping includes first-class support for **Reasoning Tokens** (see [Vol. 45](./VOL_45_THINK_MODE.md)), allowing the model to perform Chain-of-Thought (CoT) processing before responding.

---

## 📐 Header Mapping & Metadata

When the SDK sends a request, it includes specialized headers that the Sogni Orchestrator uses to route your job:
- **`x-sogni-network`**: Controls which worker tier (`fast`/`relaxed`) handles the chat.
- **`x-sogni-app-id`**: Identifies your application for billing and analytics.

---

## ⚠️ Summary of Best Practices

- **Use standardized models**: For maximum compatibility, stick to the `qwen3.5` family, as they have the most robust alignment with OpenAI-style system instructions.
- **Handle Streaming**: Always use `stream: true` for user-facing chat apps. Sogni's decentralized architecture is optimized for real-time token delivery (see [Vol. 46](./VOL_46_STREAM_CHUNKS.md)).

---

**Next Volume**: [Vol. 44: Context Window Mgmt](./VOL_44_CONTEXT_128K.md)
