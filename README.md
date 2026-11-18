# Khaled Almasharqah — Engineering Portfolio

**Live Site:** [https://khaledalm-06.github.io/](https://khaledalm-06.github.io/)

Personal portfolio for **Khaled Almasharqah** (Third-Year Software Engineering Student at Heriot-Watt University). Built in vanilla HTML, CSS, and JavaScript with zero external runtime dependencies.

## Automatic Hosting & Updates (GitHub Pages)

This repository automatically rebuilds and updates **`https://khaledalm-06.github.io/`** whenever changes are pushed to the `main` branch via GitHub's built-in `pages-build-deployment` action (with `.nojekyll` ensuring static assets deploy as-is with zero Jekyll processing).

To update the live site:

```bash
git add .
git commit -m "Update portfolio"
git push
```

GitHub automatically deploys the updated files to `https://khaledalm-06.github.io/` within ~30–60 seconds.

> **Optional Custom Actions Workflow:** If you also want a custom pre-deploy check (such as `node --check app.js`) via GitHub Actions, go to **Settings → Pages → Build and deployment → Source → GitHub Actions** on GitHub and click **Static HTML → Configure**.

## Under the Hood

- **Custom Virtual DOM & Redux-Style Store (`MiniVDOM` + `createStore`)**: Drives the Bento grid and live render/diff telemetry bar.
- **3D Software Rasterizer & 2D Impulse Physics**: Interactive browser canvases implementing 4×4 projection matrices, backface culling, circle-circle impulse restitution, and Verlet constraints.
- **GPT-2 Attention & Enkel `0xCAFEBABE` JVM Inspector**: Interactive causality heat-map and opcode stack walkthrough.
- **1-Page Printable CV Modal**: Clean `@media print` stylesheet for exporting a tailored PDF CV directly from the browser.

## Preview Locally

```bash
python -m http.server 8090
```

Open `http://127.0.0.1:8090`.
