# 🔌 Platform Tools & Function Calling Orchestration

This module describes how to turn an LLM into an active orchestrator of the Sogni Supernet. By leveraging **Tool Calling** (Function Calling), you can enable the AI to perform complex actions—including generating its own images and videos—based on natural language intent.

---

## 🛠️ The Tool Calling Loop

Sogni supports the official OpenAI tool-calling schema. The process is a conversational "tennis match" between your app and the LLM.

1. **User asks a question** (e.g., "What was my balance again?").
2. **App sends message** with a list of `tools` (function definitions).
3. **LLM returns a `tool_call`** request instead of text content.
4. **App executes the tool** locally (fetching balance from SDK).
5. **App sends result** back to the LLM.
6. **LLM provides final answer** in natural language.

---

## 🎨 Sogni Platform Tools: Media via Chat

One of the most powerful features of the SDK is the ability for the LLM to "see" creative intent and trigger Sogni's generation APIs automatically.

### The "Intent Detection" Pattern
By providing the LLM with tool definitions for `generateImage` and `generateVideo`, you can build "Creative Assistants."

**Example Workflow**:
- **User**: "Create a 5-second video of an astronaut floating in space."
- **LLM**: *Detects video intent* -> *Calls `generateVideo` tool* with specific parameters (LTX-2.3 model, high-quality prompt, 24fps).
- **App**: Receives the tool call, initiates the Sogni Project, and returns the project status to the LLM.

---

## 💻 Implementation: Custom Tools

Here is how you define a function that the LLM can "call."

```javascript
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_account_details',
      description: 'Get the current user balance and wallet info',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
];

const response = await sogni.chat.completions.create({
  model: 'qwen3.5-35b-a3b-gguf-q4km',
  messages: [{ role: 'user', content: 'Do I have enough tokens for a video?' }],
  tools,
  tool_choice: 'auto'
});
```

---

## ⚙️ Manual vs. Auto-Execution

### Automatic Tool Execution
The Sogni SDK provides an `autoExecuteTools` mode for simplicity.
```javascript
const response = await sogni.projects.chatChatCompletion({
  messages,
  tools,
  autoExecuteTools: true // The SDK handles the loop for you
});
```
> [!IMPORTANT]
> **Streaming Limitation**: `autoExecuteTools` is generally incompatible with `stream: true`. For streaming responses that involve tool calls, you must manage the loop manually in your UI.

### Manual Orchestration (Recommended for Video/Image)
Creative generation tools often take time. For these, it is better to handle the execution manually:
1. Parse the `tool_calls` in the response.
2. Trigger the `sogni.projects.create()` logic.
3. Update the UI with a "Generating Video..." state.
4. Feed the Result URL back to the LLM once complete.

---

## 🧠 Advanced: Reasoning before Action

Using the **Thinking Mode** (`think: true`) alongside tools provides the highest quality results. The model can "think" through the prompt engineering process before it decides which generation parameters (steps, guidance, sampler) to send to the `generateImage` tool.

**Logic Flow**:
`User Prompt` -> `LLM Thinking` -> `Parameter Optimization` -> `Tool Call` -> `Sogni Generation`.

---

**Next Step**: [09_ECONOMICS_AND_OPTIMIZATION.md](./09_ECONOMICS_AND_OPTIMIZATION.md)
