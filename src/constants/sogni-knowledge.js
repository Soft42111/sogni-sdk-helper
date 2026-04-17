export const SOGNI_KNOWLEDGE_BASE = `
SOGNI SDK COMPREHENSIVE TECHNICAL MANIFEST (v4.1+)

1. AUTH & ACCOUNT:
- SogniClient.createInstance({ appId, apiKey, network: 'fast'|'relaxed' })
- sogni.account.create({ username, email, password, turnstileToken, referralCode })
- sogni.account.login(username, password)
- sogni.account.accountBalance() -> returns settledSpark, settledSogni

2. LLM CHAT (OpenAI Compatible):
- sogni.chat.completions.create({ model, messages, stream: true|false })
- Recommended Models: 'qwen3.5-35b-a3b-gguf-q4km' (Reasoning), 'qwen3-30b-a3b-gptq-int4' (Fast)
- Features: Supports tool calling and 128K context.

3. IMAGE GENERATION:
- sogni.projects.create({ type: 'image', modelId, positivePrompt, ... })
- Models: 'flux1-schnell-fp8' (4-8 steps, photoreal), 'z_image_turbo_bf16' (8-12 steps, ultra-fast).
- Guidance: Turbo models use 1.0-1.5. Standard models use 7.0-9.0.

4. VIDEO GENERATION (Fast Network ONLY):
- Models: 'wan_v2.2-14b-fp8_t2v_lightx2v' (Preview), 'wan_v2.2-14b-fp8_t2v' (Quality), 'ltx23-22b-fp8_t2v_dev'.
- Parameters: teacacheThreshold: 0.3 (30% speed boost for WAN), fps (internal 16 -> interpolated 32).
- V2V: 'ltx2-19b-fp8_v2v_distilled' supports referenceVideo and ControlNet (Canny, Depth, Pose).

5. AUDIO/MUSIC:
- Model: 'ace_step_1.5_turbo' (music + lyrics).
- Parameters: bpm, keyscale, lyrics, duration (up to 60s).

6. CORE PATTERN:
- Create Project -> Wait for completion -> URLs expire in 24h.
- Use teacacheStrength (0.3-0.8) for creative morphing in video.
`;
