# 🤖 Vol. 27: Qwen Image Edit: Contextual Visual Reasoning

The **Qwen Image Edit** model family represents the intersection of Large Language Models (LLMs) and Image Synthesis. Unlike traditional models that use a separate prompt, Qwen treats editing as a "Visual Conversation."

---

## 🏛️ The Multi-Modal Architecture

Qwen Image Edit utilizes a unified transformer that can process both image pixels and text tokens in the same embedding space. 
- **Context Awareness**: The model "sees" the source image and understands its semantic content (e.g., "This is a coffee cup on a wooden table").
- **Instructional Editing**: You don't need to specify every detail of the change; you just give a natural language instruction.

---

## 🛠️ SDK Implementation

In the Sogni SDK, Qwen Image Edit projects use specialized model IDs and require a source `image`.

```javascript
const project = await sogni.projects.create({
  type: 'image',
  modelId: 'qwen_image_edit_2511_fp8',
  image: sourceImageBuffer,
  positivePrompt: 'Add a small robotic arm coming out of the coffee cup',
  steps: 8,
  guidance: 1.5 // LLM-based guidance, keep low
});
```

---

## 🎨 Transforming via Conversation

Unlike `img2img` (Vol. 26), which changes the image globally based on noise, Qwen can perform **Local, Semantically-Rich** edits.

### 1. Semantic Addition
- **Input**: "Make the man wear a tuxedo."
- **Logic**: Qwen identifies "man" and "clothes," and redraws only the clothing while preserving the man's face, hair, and the background.

### 2. Style Translation
- **Input**: "Make this look like a painting by Van Gogh."
- **Logic**: Qwen understands the artistic style of Van Gogh and applies it as a global semantic filter, maintaining the original subject's recognizability.

### 3. Subject Interaction
- **Input**: "Put a cat next to the tree."
- **Logic**: Qwen understands the spatial concept of "next to" and "tree," placing a cat in a semantically appropriate position.

---

## 📐 Optimization & Performance

### lightning vs. Standard
Sogni provides two versions of this model:
- **`qwen_image_edit_2511_fp8_lightning`**: Optimized for speed. It uses aggressive distillation to provide edits in 4-6 steps. Perfect for real-time prototyping.
- **`qwen_image_edit_2511_fp8`**: The standard high-fidelity model. Better for complex instructions and high-resolution preservation.

### Guidance Calibration
Because Qwen is an instruction-following model, it is sensitive to the `guidance` parameter.
- **1.0 - 2.0**: The optimal "Sweet Spot." Higher values often cause the LLM to over-index on the text instructions, leading to a loss of the source image's identity.

---

## 🧪 Comparison to Inpainting

Traditional **Inpainting** requires a "Mask" (a black-and-white image telling the AI where to paint).
- **Qwen's Advantage**: No mask is required. The model performs its own "Semantic Masking" based on your text prompt. This makes it ideal for mobile apps or chat interfaces where drawing a mask is difficult for the user.

---

**Next Volume**: [Vol. 28: WAN 16fps Engine](./VOL_28_WAN_ENGINE.md)
