# 🎲 Vol. 42: Multi-Take Seeding & Audio Variations

In professional music production, rarely is the first recording the "final" one. The Sogni SDK's **Multi-Take** strategy allows you to use `seed` variation and `numberOfMedia` to select the perfect sonic performance. This volume explores the workflow of audio refinement.

---

## 🏛️ The Seed as a "Performance"

In audio generation, the `seed` doesn't just change the arrangement; it changes the **Performance**.
- **Seed A**: Might have a more aggressive drum hit.
- **Seed B**: Might have a smoother vocal vibrato.
- **Seed C**: Might have a different melodic flourish in the bridge.

By generating multiple variations (takes) of the same prompt, you can choose the one that fits your cinematic vision best.

---

## 🛠️ SDK Implementation: Bulk Takes

The Sogni SDK allows you to generate multiple takes in a single project request using the `numberOfMedia` parameter.

```javascript
const project = await sogni.projects.create({
  type: 'audio',
  network: 'fast',
  modelId: 'ace_step_1.5_hq',
  positivePrompt: 'A lush lo-fi hip hop beat with rain sounds',
  numberOfMedia: 4, // Generates 4 unique takes simultaneously
  duration: 30
});

// Wait for all takes
const urls = await project.waitForCompletion();
console.log('Take 1:', urls[0]);
console.log('Take 2:', urls[1]);
```

---

## 🧪 "Locking" the Take

Once you find a "take" (a seed) that you love, you can perform **Seed-Based Refinement**.

### The Refinement Workflow:
1.  **Exploration**: Generate 4 takes with different random seeds. 
2.  **Selection**: Identify the seed of the best take (e.g., `seed: 12345`).
3.  **Iteration**: Re-run the project with `seed: 12345` but tweak the `bpm` or `prompt` slightly (e.g., "Add more reverb").

Because you've locked the seed, the **fundamental performance** (the melody and vocal tone) will stay consistent, but the "production" (the effects and tempo) will shift around it.

---

## 📐 Audio Variation Strengths

Unlike image-to-image, audio variation is currently controlled primarily through the **Prompt** and **Seeds**. 

### Prompt-Based Variation:
- **"More energy"**: Drives the ACE-Step transformer to prioritize high-frequency accents and faster transients.
- **"Mellow version"**: Encourages the model to use broader, smoother frequency sweeps in the spectrogram.

---

## 🎨 Best Practices for Multi-Take Selection

1.  **Check the Transients**: Listen to the first 5 seconds. If the drums sound "muddled," discard the take. The spectrogram resolution is highest in the initial seconds.
2.  **Vocal Clarity**: If using lyrics (Vol. 41), check for "Slurring." Some seeds will naturally have clearer pronunciation than others based on the initial noise manifold.
3.  **Endings**: Generative audio can sometimes "trail off" awkwardly. Generate multiple takes to find one with a musically satisfying ending or fade-out.

---

**Next Division: Division IX: Cognitive Layer (LLM)**
[Vol. 43: OpenAI Layer Mapping](./VOL_43_OPENAI_COMPAT.md)
