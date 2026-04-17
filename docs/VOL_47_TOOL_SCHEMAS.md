# 🛠️ Vol. 47: Tool-Calling Schemas: Drafting & Validation

The Sogni SDK supports **Native Tool Calling** (also known as Function Calling). This allows the LLM to interact with your application's logic or the Sogni Platform Tools to generate media. This volume explores how to draft, register, and validate these schemas.

---

## 🏛️ The "Model-as-Orchestrator" Pattern

In a tool-calling workflow, the LLM doesn't just talk; it decides and executes.
1.  **Request**: The user asks for something external (e.g., "Create an image of a cat").
2.  **Tool Selection**: The LLM looks at your provided `tools` list and selects the most relevant one.
3.  **Argument Drafting**: The LLM extracts the necessary parameters from the user's prompt (e.g., `positivePrompt: "a cat"`).
4.  **Verification**: The SDK validates the arguments against your JSON Schema before execution.

---

## 🏗️ Drafting the JSON Schema

Sogni follows the standard OpenAI `tool` format. Every tool must have a `name`, `description`, and a `parameters` object.

```javascript
const myTools = [
  {
    type: 'function',
    function: {
      name: 'get_current_weather',
      description: 'Get the current weather in a given location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'The city and state' },
          unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
        },
        required: ['location']
      }
    }
  }
];
```

---

## 🛠️ SDK Implementation: Handling the Call

The `chatCompletion` method returns a `tool_calls` array when the model decides to use a tool.

```javascript
const response = await sogni.chat.completions.create({
  model: 'qwen3.5-35b-a3b-gguf-q4km',
  messages: [...],
  tools: myTools,
  tool_choice: 'auto'
});

const toolCall = response.choices[0].message.tool_calls[0];
if (toolCall) {
  const args = JSON.parse(toolCall.function.arguments);
  console.log(`Executing ${toolCall.function.name} in ${args.location}`);
  
  // Call your local function here...
}
```

---

## 🎨 Sogni Platform Tools

Sogni provides a suite of **Pre-Built Platform Tools** designed to be called by the LLM to orchestrate the Supernet's media generation.

- **`generate_image`**: Allows the LLM to create Flux, SD, or Z-Image results.
- **`generate_video`**: Orchestrates WAN or LTX video pipelines.
- **`generate_audio`**: Triggers the ACE-Step music engine.

**Note**: To enable these, you must pass the `sogni_tools: true` flag in your request. The LLM will then automatically "Intent Detect" which tool to use based on natural language.

---

## 📐 Schema Validation Best Practices

1.  **Explicit Descriptions**: The model only knows what a tool does based on the `description`. Be hyper-specific (e.g., instead of "makes image," use "Generates a cinematic 1024x1024 image using the Flux-Schnell model").
2.  **Strict Enums**: If a function only accepts specific colors or sizes, use the `enum` property in the JSON schema. This prevents the LLM from "guessing" invalid arguments.
3.  **Tool Output Loop**: Once your local function completes, you must send the result back to the LLM as a message with `role: 'tool'` so it can summarize the result for the user.

---

**Next Division: Division X: Reliability & Optimization**
[Vol. 48: TeaCache Optimization](./VOL_48_TEACACHE.md)
