# Khaled Almasharqah — Interactive Engineering Portfolio

Personal website for **Khaled Almasharqah** (Third-Year Software Engineering Student at Heriot-Watt University).

## Architecture

Zero external CSS/JS runtime dependencies — powered by lightweight implementations of Khaled's own from-scratch systems:
- **Custom Virtual DOM & Redux-Style Store (`MiniVDOM` + `createStore`)**: Drives the Bento grid and live render/diff telemetry bar.
- **3D Software Rasterizer & 2D Impulse Physics**: Interactive browser canvases implementing 4×4 projection matrices, backface culling, circle-circle impulse restitution, and Verlet constraints.
- **GPT-2 Attention & Enkel `0xCAFEBABE` JVM Inspector**: Interactive causality heat-map and opcode stack walkthrough.

## Preview Locally

```bash
python -m http.server 8090
```

Open `http://127.0.0.1:8090`.
