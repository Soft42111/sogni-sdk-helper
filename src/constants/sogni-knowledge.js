export const SOGNI_KNOWLEDGE_BASE = `
Sogni SDK Knowledge Base (v4.1+):
- Network: 'fast' (NVIDIA GPUs, required for video/turbo), 'relaxed' (Apple Silicon).
- Model Families:
  * Images: flux1-schnell-fp8 (4 steps, photorealistic), z_image_turbo_bf16 (8 steps, ultra-fast).
  * Video: wan_v2.2-14b-fp8_t2v (cinematic), ltx23-22b-fp8_t2v_dev (precise motion).
  * Audio: ace_step_1.5_turbo (music/lyrics).
  * LLM: qwen3.5-35b-a3b-gguf-q4km (128k context, deep reasoning).
- Economy: $SPARK (standard currency), $SOGNI (native utility/rewards).
- Lifecycle: SogniClient.createInstance({ appId }) -> client.account.login() or .create() -> client.chat.completions.create().
- Feature: Use teacacheThreshold: 0.3 for faster WAN video generation.
- Security: API keys in .env, appId unique per app.
`;
