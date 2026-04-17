export const SOGNI_KB = {
  overview: {
    title: "Sogni SDK Overview",
    content: "The Sogni SDK (@sogni-ai/sogni-client) is a unified interface for the Sogni Supernet, a decentralized network of GPU workers. It provides access to high-fidelity image synthesis, video generation, music composition, and LLM chat completions.",
    keywords: ["what is", "overview", "introduction", "about"]
  },
  models: {
    title: "Supported Models",
    content: `• **Images**: Flux1-schnell, Z-Image Turbo, SD 1.5, Qwen Edit.
• **Video**: WAN 2.2 (high motion), LTX-2.3 (temporal control).
• **Audio**: ACE-Step 1.5 (music/vocals).
• **LLM**: Qwen 3.5 (128K context, thinking mode).`,
    keywords: ["models", "list models", "which models", "flux", "wan", "qwen"]
  },
  installation: {
    title: "Installation",
    content: "Install via npm:\n`npm install @sogni-ai/sogni-client`",
    keywords: ["install", "setup", "npm", "get started"]
  },
  auth: {
    title: "Authentication",
    content: "Initialize the client with an API Key:\n```javascript\nconst sogni = await SogniClient.createInstance({\n  appId: 'your-app-id',\n  apiKey: 'YOUR_KEY',\n  network: 'fast'\n});\n```",
    keywords: ["auth", "api key", "login", "credentials"]
  },
  workflow: {
    title: "Core Workflow",
    content: `1. **Create Project**: \`sogni.projects.create({ type, modelId, ... })\`
2. **Listen**: \`project.on('progress', cb)\`
3. **Wait**: \`const urls = await project.waitForCompletion()\`
4. **Cache**: Results expire in 24 hours.`,
    keywords: ["how it works", "workflow", "lifecycle", "process"]
  },
  tokens: {
    title: "Dual-Token Economy",
    content: "Sogni uses a dual-token system: **$SPARK** (for instant inference) and **$SOGNI** (protocol token). Workers are paid in $SOGNI.",
    keywords: ["tokens", "spark", "sogni", "cost", "credits"]
  }
};

export const getResponse = (query) => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("hello") || lowerQuery.includes("hi")) {
    return "Hello! I'm your Sogni SDK assistant. Ask me about models, installation, or the Supernet!";
  }

  for (const key in SOGNI_KB) {
    if (SOGNI_KB[key].keywords.some(k => lowerQuery.includes(k))) {
      return `${SOGNI_KB[key].title}\n\n${SOGNI_KB[key].content}`;
    }
  }

  return "I'm not sure about that. Try asking about 'models', 'installation', 'workflow', or 'what is Sogni SDK'. This info is based on the official documentation.";
};
