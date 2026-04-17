# 🤖 LLM Intelligence: The Sogni Chat completions API

While Sogni is famous for its visual Supernet, it also hosts a powerful, decentralized **Large Language Model (LLM)** inference tier. The Sogni Chat API is built to be 100% compatible with the OpenAI specification, allowing for seamless migration.

---

## 🧠 Featured Models

Sogni focuses on high-capacity models with extended context windows, perfect for creative orchestration.

| Model ID | Base Model | Context Window | Best For |
|----------|------------|----------------|----------|
| `qwen3.5-35b-a3b-gguf-q4km` | Qwen 3.5 | **128K Tokens** | Deep reasoning, long-form content. |
| `qwen3-30b-a3b-gptq-int4` | Qwen 3.0 | 32K Tokens | Fast chat, prompt engineering. |

---

## 🛠️ Basic Chat Completion

The SDK exposes chat functionality through `sogni.chat.completions.create()`.

```javascript
const response = await sogni.chat.completions.create({
  model: 'qwen3.5-35b-a3b-gguf-q4km',
  messages: [
    { role: 'system', content: 'You are a creative director.' },
    { role: 'user', content: 'Suggest 5 cinematic scenes for a cyberpunk film.' }
  ],
  max_tokens: 4096,
  temperature: 0.7,
  top_p: 0.95
});

console.log(response.choices[0].message.content);
```

---

## ⚡ Streaming: Token-by-Token Delivery

For a premium user experience, use the `stream: true` parameter. This allows your UI to render the response as it is generated, rather than waiting for the entire block.

```javascript
const stream = await sogni.projects.chatCompletionStream({
  model: 'qwen3.5-35b-a3b-gguf-q4km',
  messages: [{ role: 'user', content: 'Tell me a long story.' }],
  stream: true
});

for await (const chunk of stream) {
  const delta = chunk.choices[0].delta.content || '';
  process.stdout.write(delta);
}
```

---

## 🧠 Thinking Mode (Reasoning)

The latest Qwen models on the Sogni Supernet support a specialized **Thinking Mode**. In this mode, the model outputs its "internal monologue" or reasoning process before providing the final answer.

- **How to enable**: Pass `think: true` in your parameters (or use certain system prompt keywords depending on model).
- **Format**: The thinking content is wrapped in `<think>...</think>` tags.

> [!TIP]
> Use **Thinking Mode** for complex tasks like prompt engineering or code generation where the model needs to "plan" its output.

---

## 🔁 Multi-Turn Conversations

To maintain context, you must append the assistant's previous responses back into the `messages` array for subsequent calls.

```javascript
const messages = [
  { role: 'system', content: 'You are an AI assistant.' },
  { role: 'user', content: 'Who won the world series in 2024?' }
];

// Round 1
const turn1 = await sogni.chat.completions.create({ messages, ... });
messages.push(turn1.choices[0].message);

// Round 2
messages.push({ role: 'user', content: 'Who was the MVP?' });
const turn2 = await sogni.chat.completions.create({ messages, ... });
```

---

## 📏 Context Window Constraints

- **Input Tokens**: Systems prompts, history, and the current user prompt.
- **Output Tokens**: Controlled by `max_tokens`.
- **Note**: If the combined total exceeds the model's limit (e.g., 128K), you will receive a `finish_reason: 'length'` error.

---

## 🔌 OpenAI Compatibility

If you have an existing codebase using the standard `openai` npm package, you can point it to Sogni with minimal changes:

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_SOGNI_API_KEY',
  baseURL: 'https://api.sogni.ai/v1' // The magic line
});

const chatCompletion = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello Sogni!' }],
  model: 'qwen3.5-35b-a3b-gguf-q4km',
});
```

---

**Next Step**: [08_PLATFORM_TOOLS_ORCHESTRATION.md](./08_PLATFORM_TOOLS_ORCHESTRATION.md)
