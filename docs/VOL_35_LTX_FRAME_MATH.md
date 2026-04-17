# 📐 Vol. 35: LTX Frame Calculation: The `1 + n*8` Distribution

One of the most unique technical aspects of the LTX-2.3 architecture on the Sogni Supernet is its requirement for specific frame counts. This volume explains the math behind LTX frame distribution and how to calculate accurate durations.

---

## 🏛️ The Latent Block Structure

The LTX-2.3 transformer processes video in fixed "Temporal Blocks." Each block is composed of 8 frames.
- **Why?**: This grouping allows for optimized attention calculations.
- **The Result**: Every LTX video must follow the mathematical pattern of **`1 + (number_of_blocks * 8)`**.

---

## 🎞️ Calculating Valid Durations

When using the Sogni SDK, you typically define `duration` (in seconds) and `fps`. The SDK automatically calculates the nearest valid frame count for the LTX models.

### Common Frame Counts:
| Blocks | Total Frames | Approx Duration (24fps) |
|--------|--------------|-------------------------|
| 1 | 9 Frames | 0.37s |
| 5 | 41 Frames | 1.70s |
| 10 | 81 Frames | 3.37s |
| 15 | 121 Frames | 5.04s |
| 20 | 161 Frames | 6.70s |

### The Math for Developers:
If you need an exact 5-second video at 24fps:
1.  **Desired Frames**: 5.0 * 24 = 120.
2.  **Nearest LTX Match**: 121 frames (`(15 * 8) + 1`).
3.  **Result**: The SDK will slightly adjust the duration to **5.04 seconds** to maintain mathematical alignment with the LTX transformer.

---

## 🛠️ Performance Optimization via Framing

Generating large frame counts (e.g., 241+) on LTX-2.3 can be extremely computationally expensive.

### Strategies for Efficiency:
- **Low-FPS Generation**: Generating at **12fps** instead of 24fps allows for a longer video duration within the same "Frame Budget." 
  - 121 frames at 12fps = **10 seconds** of video.
  - 121 frames at 24fps = **5 seconds** of video.
- **The "Stitch" Workflow**: For very long cinematic sequences, it is often better to generate multiple 5-second segments (using the end-frame of one as the start-frame of the next) rather than asking the Supernet for one massive 20-second block.

---

## 🧪 Advanced Frame Stepping

For professional animators, understanding the `1+n*8` rule allows you to plan your keyframes (Vol. 36) exactly on the "Block Transitions," ensuring that focal points of motion occur with maximum temporal resolution.

---

## ⚠️ Summary of Best Practices

- **Avoid Odd Seconds**: Instead of asking for "4 seconds," ask for a duration that maps to a block (e.g., 3.37s or 5.04s). This prevents the SDK from having to perform "sub-frame" cropping.
- **Network Choice**: Because LTX is a 22B parameter model, even small frame counts require the **Fast Network** to ensure the worker doesn't time out during block synthesis.

---

**Next Volume**: [Vol. 36: Keyframe Adherence](./VOL_36_LTX_KEYFRAMES.md)
