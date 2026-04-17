# 🧠 Vol. 45: Thinking Mode: Chain-of-Thought (CoT) Logic

Sogni's **Thinking Mode** (implemented in models like Qwen 3.5 35B and 30B) represents a paradigm shift in how AI solves complex problems. By enabling CoT reasoning, the model decomposes a problem into logical steps before delivering its final answer.

---

## 🏛️ What is Thinking Mode?

Traditionally, LLMs predict the next token based on statistical probability. "Thinking Mode" forces the model to use internal reasoning tokens to:
1.  **Deconstruct**: Break the user's prompt into sub-tasks.
2.  **Verify**: Check its own internal facts and logic.
3.  **Refine**: Draft and self-correct the response in real-time.

---

## 🏗️ The `<think>` Block Architecture

In the Sogni SDK, thinking tokens are delivered as part of the stream but are contained within special tags.

### Protocol Example:
```text
<think>
I need to calculate the frame count for a 5-second LTX video at 24fps.
Math: 5 * 24 = 120.
Requirement: 1 + n*8.
Nearest block: 15 * 8 + 1 = 121.
I should mention the 121 frame count.
</think>
The optimal frame count for your 5-second video is 121 frames.
```

---

## 🛠️ SDK Implementation

To enable thinking mode, you must call a model that explicitly supports the `thinking` capability. 

```javascript
const response = await sogni.chat.completions.create({
  model: 'qwen3.5-35b-a3b-gguf-q4km', // Supports reasoning
  messages: [...],
  stream: true,
  // Thinking tokens are automatically included in supported models
});

// Listening for thinking deltas
response.on('delta', (chunk) => {
  if (chunk.reasoning) {
    console.log('Model is thinking:', chunk.reasoning);
  }
});
```

---

## ⚡ Benefits of CoT Logic

### 1. Superior Accuracy in Math & Logic
Standard models often fail at multi-step arithmetic. Thinking mode allows the model to "show its work," which dramatically increases the success rate of complex calculations.

### 2. Narrative Consistency
When generating long-form stories or codebases, thinking mode helps the model maintain "State" and avoid contradictions.

### 3. Debugging Transparency
As a developer, seeing the `<think>` block allows you to understand *why* the AI gave a certain answer. If the AI hallucinates, you can often find the moment its logic diverged in the thinking stream.

---

## 💰 Resource Consumption

**CRITICAL**: Thinking tokens are **billed exactly like output tokens**.
- A model might "think" for 1,000 tokens before giving a 10-token answer. 
- You must account for this in your project cost estimation and balance management (Vol. 10).

---

**Next Volume**: [Vol. 46: Chunk Delivery Delta](./VOL_46_STREAM_CHUNKS.md)
