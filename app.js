"use strict";

/* ============================================================================
 * 1. CUSTOM MINIVDOM + REDUX-STYLE REACTIVE STORE (Projects #053 & #060)
 * ============================================================================ */
function h(type, props, ...children) {
  const flat = [];
  const stack = children.slice().reverse();
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      for (let i = item.length - 1; i >= 0; i--) stack.push(item[i]);
    } else if (item !== null && item !== undefined && typeof item !== "boolean") {
      flat.push(typeof item === "object" ? item : { type: "TEXT", props: { nodeValue: String(item) } });
    }
  }
  return { type, props: props || {}, children: flat };
}

function createDomFromVNode(vnode) {
  if (vnode.type === "TEXT") return document.createTextNode(vnode.props.nodeValue);
  const el = vnode.type.startsWith("svg:")
    ? document.createElementNS("http://www.w3.org/2000/svg", vnode.type.slice(4))
    : document.createElement(vnode.type);

  for (const [k, v] of Object.entries(vnode.props)) {
    if (k.startsWith("on") && typeof v === "function") {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === "className") {
      el.setAttribute("class", v);
    } else if (k === "html") {
      el.innerHTML = v;
    } else if (v !== false && v !== null && v !== undefined) {
      el.setAttribute(k, String(v));
    }
  }
  for (const c of vnode.children) el.appendChild(createDomFromVNode(c));
  return el;
}

function mountVDOM(rootEl, vnode) {
  const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
  rootEl.innerHTML = "";
  rootEl.appendChild(createDomFromVNode(vnode));
  const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
  return Math.max(0.05, Number((t1 - t0).toFixed(2)));
}

function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach((fn) => fn(state, action));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };
}

const initialState = {
  persona: "suit",
  bentoFilter: "all",
  renderMode3D: "gouraud",
  inspectorTab: "attention",
  selectedToken: 2,
  jvmStep: 0,
  showVNodeTree: false,
  renderCount: 0,
  lastDiffMs: 0.12,
  lastAction: "INIT_STORE"
};

function portfolioReducer(state, action) {
  switch (action.type) {
    case "SWITCH_PERSONA":
      return { ...state, persona: action.persona, lastAction: `SWITCH_PERSONA(${action.persona.toUpperCase()})` };
    case "FILTER_BENTO":
      return { ...state, bentoFilter: action.filter, lastAction: `FILTER_BENTO(${action.filter.toUpperCase()})` };
    case "SET_RENDER_3D":
      return { ...state, renderMode3D: action.mode, lastAction: `RASTER_MODE(${action.mode.toUpperCase()})` };
    case "SET_INSPECTOR_TAB":
      return { ...state, inspectorTab: action.tab, lastAction: `INSPECTOR(${action.tab.toUpperCase()})` };
    case "SELECT_TOKEN":
      return { ...state, selectedToken: action.index, lastAction: `ATTEND_TOKEN(${action.index})` };
    case "STEP_JVM":
      return { ...state, jvmStep: action.step, lastAction: `JVM_STEP(${action.step})` };
    case "TOGGLE_VDOM_TREE":
      return { ...state, showVNodeTree: !state.showVNodeTree, lastAction: "TOGGLE_VNODE_TREE" };
    default:
      return state;
  }
}

const store = createStore(portfolioReducer, initialState);

/* ============================================================================
 * 2. DATA SETS
 * ============================================================================ */
const BENTO_FRAMES = [
  {
    id: "hw-eng",
    group: "edu",
    span: "span-7",
    tag: "HERIOT-WATT UNIVERSITY · YEAR 3",
    date: "2024 — PRESENT",
    title: "Software Engineering Degree",
    desc: "C99 systems & memory management, algorithmic complexity proofs, Scrum group delivery & OpenStreetMap transport systems.",
    graphicType: "modules"
  },
  {
    id: "bilingual",
    group: "work",
    span: "span-5",
    tag: "COMMUNICATION · BILINGUAL",
    date: "ENGLISH & ARABIC",
    title: "Fluent Dual-Language Bridge",
    desc: "Fluent in English and Arabic — navigating diverse customer environments, classrooms, and collaborative teams clearly.",
    graphicType: "bilingual"
  },
  {
    id: "vue-ops",
    group: "work",
    span: "span-6",
    tag: "VUE CINEMA & FRONT OF HOUSE",
    date: "2024 — 2025",
    title: "Composed Under Peak Load",
    desc: "Front-line ticket kiosk and scanner troubleshooting during sold-out screenings, POS operations, and calm conflict resolution.",
    graphicType: "pulse"
  },
  {
    id: "mentorship",
    group: "work",
    span: "span-6",
    tag: "YOUTH MENTORSHIP, SCOUTING & TEACHING SUPPORT",
    date: "2021 — 2024",
    title: "Mentorship & Language Support",
    desc: "Mentored teens aged 13–17 in digital literacy workshops, led outdoor Scout team challenges, and supported Arabic & English classes.",
    graphicType: "nodes"
  }
];

const LAB_PROJECTS = [
  { id: 4, title: "3D Raytracer & Rasterizer", lang: "JavaScript", url: "https://github.com/KhaledAlm-06/3d-raytracer-and-rasterizer-js" },
  { id: 6, title: "GPT-2 Language Model (BPE + Autograd)", lang: "Python", url: "https://github.com/KhaledAlm-06/gpt-llm-from-scratch-python" },
  { id: 7, title: "GRPO Reasoning LLM + Distillation", lang: "Python", url: "https://github.com/KhaledAlm-06/reasoning-llm-grpo-from-scratch" },
  { id: 8, title: "DDPM Diffusion Image Generator", lang: "Python", url: "https://github.com/KhaledAlm-06/ddpm-diffusion-model-from-scratch" },
  { id: 10, title: "Hybrid BM25 + Vector RAG Search", lang: "Python", url: "https://github.com/KhaledAlm-06/hybrid-rag-search-engine-python" },
  { id: 11, title: "Sparse Autoencoders (Interpretability)", lang: "Python", url: "https://github.com/KhaledAlm-06/sparse-autoencoder-interpretability" },
  { id: 15, title: "Asyncio BitTorrent Client", lang: "Python", url: "https://github.com/KhaledAlm-06/async-bittorrent-client-python" },
  { id: 25, title: "secp256k1 ECDSA PoW Blockchain", lang: "Python", url: "https://github.com/KhaledAlm-06/secp256k1-pow-blockchain-python" },
  { id: 41, title: "DBDB Copy-on-Write Storage Engine", lang: "Python", url: "https://github.com/KhaledAlm-06/cow-btree-storage-engine-python" },
  { id: 42, title: "Multi-Threaded RESP2 Redis Server", lang: "Python", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/08-database/042-python-write-your-own-miniature-redis-with-python" },
  { id: 43, title: "Kafka Segmented Commit-Log Broker", lang: "Java", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/09-distributed-systems/043-java-building-your-own-kafka-like-system-from-scratch-a-step-by-s" },
  { id: 44, title: "Linux Container Runtime (OverlayFS)", lang: "Python", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/10-docker/044-python-a-workshop-on-linux-containers-rebuild-docker-from-scratch" },
  { id: 46, title: "GameBoy LR35902 CPU & Scanline PPU", lang: "JavaScript", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/11-emulator-virtual-machine/046-javascript-gameboy-emulation-in-javascript" },
  { id: 60, title: "React Fiber Reconciler + Hooks", lang: "JavaScript", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/12-front-end-framework-library/060-javascript-build-your-own-react" },
  { id: 65, title: "Java 3D Game Engine & Barycentric Rasterizer", lang: "Java", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/13-game/065-java-3d-game-development-with-lwjgl-3" },
  { id: 78, title: "Git VCS Internals (wyag)", lang: "Python", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/14-git/078-python-write-yourself-a-git" },
  { id: 80, title: "Virtual Layer-2 VPN Switch", lang: "Python", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/15-network-stack/080-python-build-your-own-vpn-virtual-switch" },
  { id: 84, title: "PyTorch-Style Strided Tensor Autograd", lang: "Python", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/16-neural-network/084-python-build-deep-learning-from-scratch-reimplement-pytorch-interna" },
  { id: 93, title: "2D Rigid-Body SAT Physics Engine", lang: "JavaScript", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/17-physics-engine/093-javascript-how-physics-engines-work" },
  { id: 96, title: "Bolt OOP & Capability Compiler", lang: "OCaml", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/18-programming-language/096-ocaml-how-i-wrote-my-own-proper-programming-language-in-ocaml-and" },
  { id: 98, title: "Enkel JVM Bytecode Emitter", lang: "Java", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/18-programming-language/098-java-creating-jvm-language" },
  { id: 104, title: "C-to-x86-64 Assembly Compiler", lang: "OCaml", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/18-programming-language/104-ocaml-writing-a-c-compiler" },
  { id: 106, title: "Python 3.15 Bytecode VM", lang: "Python", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/18-programming-language/106-python-a-python-interpreter-written-in-python" },
  { id: 129, title: "Web Browser Layout & CSS Cascade Engine", lang: "Python", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/24-web-browser/129-python-browser-engineering" },
  { id: 147, title: "Incremental DAG Build System", lang: "Nim", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/26-uncategorized/147-nim-writing-a-build-system" },
  { id: 157, title: "YATA CRDT Sync Engine", lang: "Node.js", url: "https://github.com/KhaledAlm-06/build-your-own-x-portfolio/tree/main/projects/26-uncategorized/157-nodejs-build-a-synchronization-engine-with-nodejs-and-y-js" }
];

/* ============================================================================
 * 3. VDOM RENDERER FOR BENTO + TELEMETRY
 * ============================================================================ */
function buildGraphicVNode(type) {
  if (type === "modules") {
    return h(
      "div",
      { className: "module-pills" },
      h("span", { className: "mod-pill" }, "C99 Systems & Memory"),
      h("span", { className: "mod-pill" }, "Algorithms & DSA"),
      h("span", { className: "mod-pill" }, "Design & Validation"),
      h("span", { className: "mod-pill" }, "Stage 3 · Scrum & OpenStreetMap")
    );
  }
  if (type === "bilingual") {
    return h("div", {
      className: "bento-graphic",
      html: `<div class="bilingual-display"><span class="bilingual-en">EN // FLUENT</span><span class="bilingual-ar" dir="rtl">العربية</span></div>`
    });
  }
  if (type === "pulse") {
    return h("div", {
      className: "bento-graphic",
      html: `<svg width="100%" height="52" viewBox="0 0 320 52" fill="none">
        <path d="M0 32 H48 L62 12 L78 44 L94 20 L108 32 H175 L188 8 L204 46 L218 24 L232 32 H320" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="188" cy="8" r="3.5" fill="#e5c07b"/>
      </svg>`
    });
  }
  return h("div", {
    className: "bento-graphic",
    html: `<svg width="100%" height="52" viewBox="0 0 320 52" fill="none">
      <line x1="36" y1="26" x2="112" y2="14" stroke="rgba(229,192,123,0.45)" stroke-width="1.5"/>
      <line x1="112" y1="14" x2="196" y2="38" stroke="rgba(225,29,72,0.55)" stroke-width="1.5"/>
      <line x1="196" y1="38" x2="280" y2="18" stroke="rgba(229,192,123,0.45)" stroke-width="1.5"/>
      <circle cx="36" cy="26" r="5" fill="#e5c07b"/><circle cx="112" cy="14" r="6" fill="#e11d48"/>
      <circle cx="196" cy="38" r="5" fill="#e5c07b"/><circle cx="280" cy="18" r="6" fill="#e11d48"/>
    </svg>`
  });
}

function renderBentoAndTelemetry(state) {
  const bentoRoot = document.getElementById("vdom-bento-root");
  const telemetryRoot = document.getElementById("vdom-telemetry-root");
  if (!bentoRoot || !telemetryRoot) return;

  const visible = state.bentoFilter === "all"
    ? BENTO_FRAMES
    : BENTO_FRAMES.filter((f) => f.group === state.bentoFilter);

  const gridVNode = h(
    "div",
    { className: "bento-grid" },
    visible.map((f) =>
      h(
        "article",
        { className: `bento-card ${f.span}` },
        h(
          "div",
          null,
          h("div", { className: "bento-top" }, h("span", { className: "bento-tag" }, f.tag), h("span", { className: "bento-date" }, f.date)),
          h("h3", null, f.title),
          h("p", null, f.desc)
        ),
        buildGraphicVNode(f.graphicType)
      )
    )
  );

  const diffMs = mountVDOM(bentoRoot, gridVNode);
  state.renderCount += 1;
  state.lastDiffMs = diffMs;

  const vnodeSnapshot = JSON.stringify(
    {
      vnodeType: gridVNode.type,
      visibleCards: visible.map((v) => v.id),
      storeState: {
        persona: state.persona,
        bentoFilter: state.bentoFilter,
        renderMode3D: state.renderMode3D
      }
    },
    null,
    2
  );

  const telVNode = h(
    "div",
    null,
    h(
      "div",
      { className: "vdom-bar" },
      h(
        "div",
        { className: "vdom-metrics" },
        h("span", null, "ENGINE: ", h("strong", null, "Custom MiniVDOM + Redux Store")),
        h("span", null, "RENDERS: ", h("strong", null, String(state.renderCount).padStart(2, "0"))),
        h("span", null, "DIFF: ", h("strong", null, `${state.lastDiffMs}ms`)),
        h("span", null, "ACTION: ", h("span", { className: "act-val" }, state.lastAction))
      ),
      h(
        "button",
        {
          type: "button",
          className: "ctrl-btn",
          onClick: () => store.dispatch({ type: "TOGGLE_VDOM_TREE" })
        },
        state.showVNodeTree ? "Hide VNode Tree" : "Inspect VNode Tree"
      )
    ),
    state.showVNodeTree ? h("pre", { className: "vdom-tree-box" }, vnodeSnapshot) : null
  );

  mountVDOM(telemetryRoot, telVNode);
}

/* ============================================================================
 * 4. HERO DUAL-PERSONA 3D CARD STACK
 * ============================================================================ */
function initHeroCards() {
  const stage = document.getElementById("card-stage");
  const frontCard = document.getElementById("card-front");
  const backCard = document.getElementById("card-back");
  const imgFront = document.getElementById("img-front");
  const imgBack = document.getElementById("img-back");
  const sheen = document.getElementById("specular-sheen");
  const tiltReadout = document.getElementById("tilt-readout");
  const frontKicker = document.getElementById("front-cap-kicker");
  const frontTitle = document.getElementById("front-cap-title");
  if (!stage || !frontCard || !imgFront) return;

  const syncPersona = (persona) => {
    document.querySelectorAll(".persona-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-persona") === persona);
    });
    if (persona === "suit") {
      imgFront.src = "assets/suit.jpg";
      imgBack.src = "assets/helmet.jpg";
      frontKicker.textContent = "01 // ON THE CLOCK";
      frontTitle.textContent = "Software Engineering · Year 3";
    } else {
      imgFront.src = "assets/helmet.jpg";
      imgBack.src = "assets/suit.jpg";
      frontKicker.textContent = "02 // OFF THE CLOCK";
      frontTitle.textContent = "Precision, Grit & Curiosity";
    }
  };

  document.querySelectorAll(".persona-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      store.dispatch({ type: "SWITCH_PERSONA", persona: btn.getAttribute("data-persona") });
    });
  });

  stage.addEventListener("click", () => {
    const next = store.getState().persona === "suit" ? "helmet" : "suit";
    store.dispatch({ type: "SWITCH_PERSONA", persona: next });
  });

  stage.addEventListener("mousemove", (e) => {
    const rect = stage.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const rx = (-ny * 10).toFixed(2);
    const ry = (nx * 12).toFixed(2);
    frontCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    backCard.style.transform = `translate(${22 + nx * 8}px, ${14 + ny * 8}px) rotate(${5 + nx * 2}deg) scale(0.94)`;
    sheen.style.background = `radial-gradient(circle at ${50 + nx * 35}% ${50 + ny * 35}%, rgba(229,192,123,0.22), transparent 60%)`;
    const nz = Math.sqrt(Math.max(0.1, 1 - nx * nx * 0.25 - ny * ny * 0.25));
    const ndotl = Math.max(0, Math.min(1, nx * 0.2 + ny * -0.25 + nz * 0.92)).toFixed(2);
    tiltReadout.textContent = `N·L ${ndotl}`;
  });

  stage.addEventListener("mouseleave", () => {
    frontCard.style.transform = "";
    backCard.style.transform = "";
    tiltReadout.textContent = "N·L 0.94";
  });

  store.subscribe((state, action) => {
    if (action.type === "SWITCH_PERSONA") syncPersona(state.persona);
  });
}

/* ============================================================================
 * 5. PLAYABLE ENGINE 1: 3D SOFTWARE RASTERIZER (Projects #001 & #004)
 * ============================================================================ */
function init3DRasterizer() {
  const canvas = document.getElementById("canvas-3d");
  const hud = document.getElementById("hud-3d");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const phi = (1 + Math.sqrt(5)) / 2;
  const rawVerts = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
  ].map(([x, y, z]) => {
    const l = Math.hypot(x, y, z);
    return [x / l, y / l, z / l];
  });

  const faces = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
  ];

  let yaw = 0.5, pitch = 0.35;
  let dragging = false, lx = 0, ly = 0;

  canvas.addEventListener("pointerdown", (e) => { dragging = true; lx = e.clientX; ly = e.clientY; });
  window.addEventListener("pointerup", () => { dragging = false; });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    yaw += (e.clientX - lx) * 0.012;
    pitch += (e.clientY - ly) * 0.012;
    lx = e.clientX; ly = e.clientY;
  });

  document.querySelectorAll("[data-render]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-render");
      document.querySelectorAll("[data-render]").forEach((b) => b.classList.toggle("active", b === btn));
      store.dispatch({ type: "SET_RENDER_3D", mode });
    });
  });

  function frame() {
    if (!dragging) yaw += 0.008;
    const mode = store.getState().renderMode3D;
    const w = canvas.width, hPx = canvas.height;
    ctx.fillStyle = "#07080b";
    ctx.fillRect(0, 0, w, hPx);

    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);

    const projected = rawVerts.map(([x, y, z]) => {
      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp + 3.1;
      const f = 220 / z2;
      return { x: x1, y: y2, z: z2, sx: w / 2 + x1 * f, sy: hPx / 2 + y2 * f };
    });

    const tris = [];
    for (const [ia, ib, ic] of faces) {
      const a = projected[ia], b = projected[ib], c = projected[ic];
      const ux = b.x - a.x, uy = b.y - a.y, uz = b.z - a.z;
      const vx = c.x - a.x, vy = c.y - a.y, vz = c.z - a.z;
      const nx = uy * vz - uz * vy;
      const ny = uz * vx - ux * vz;
      const nz = ux * vy - uy * vx;
      const nl = Math.hypot(nx, ny, nz) || 1;
      const cx = (a.x + b.x + c.x) / 3, cyAvg = (a.y + b.y + c.y) / 3, cz = (a.z + b.z + c.z) / 3;
      if (nx * cx + ny * cyAvg + nz * cz >= 0) continue;
      const ndotl = Math.max(0.08, (nx / nl) * -0.45 + (ny / nl) * -0.5 + (nz / nl) * -0.74);
      tris.push({ a, b, c, cz, ndotl, nx: nx / nl, ny: ny / nl, nz: nz / nl });
    }

    tris.sort((p, q) => q.cz - p.cz);
    for (const t of tris) {
      ctx.beginPath();
      ctx.moveTo(t.a.sx, t.a.sy);
      ctx.lineTo(t.b.sx, t.b.sy);
      ctx.lineTo(t.c.sx, t.c.sy);
      ctx.closePath();

      if (mode === "wire") {
        ctx.strokeStyle = "#e5c07b";
        ctx.lineWidth = 1.25;
        ctx.stroke();
      } else if (mode === "normal") {
        const r = Math.round((t.nx * 0.5 + 0.5) * 235);
        const g = Math.round((t.ny * 0.5 + 0.5) * 185);
        const b = Math.round((-t.nz * 0.5 + 0.5) * 210);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
      } else {
        const r = Math.round(40 + t.ndotl * 195);
        const g = Math.round(14 + t.ndotl * 75);
        const b = Math.round(28 + t.ndotl * 68);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
        ctx.strokeStyle = "rgba(229,192,123,0.22)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    hud.textContent = `${mode.toUpperCase()} · ${tris.length} TRIS`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ============================================================================
 * 6. PLAYABLE ENGINE 2: 2D RIGID-BODY PHYSICS (Projects #093 & #095)
 * ============================================================================ */
function init2DPhysics() {
  const canvas = document.getElementById("canvas-physics");
  const hud = document.getElementById("hud-physics");
  const gravBtn = document.getElementById("phys-gravity");
  const pulseBtn = document.getElementById("phys-impulse");
  const resetBtn = document.getElementById("phys-reset");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let gravityOn = true;
  let balls = [];
  let pendBob = { x: 250, y: 95, vx: 65, vy: 0, r: 13 };
  const anchor = { x: 190, y: 20, len: 92 };

  const seed = () => {
    balls = [
      { x: 110, y: 70, vx: 90, vy: 15, r: 15, color: "#e11d48" },
      { x: 235, y: 55, vx: -75, vy: 20, r: 18, color: "#e5c07b" },
      { x: 165, y: 140, vx: 45, vy: -60, r: 12, color: "#f4f4f6" }
    ];
    pendBob = { x: 270, y: 65, vx: 0, vy: 0, r: 13 };
  };
  seed();

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    if (balls.length > 14) balls.shift();
    balls.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 200,
      vy: -80,
      r: 10 + Math.random() * 8,
      color: Math.random() > 0.45 ? "#e11d48" : "#e5c07b"
    });
  });

  gravBtn.addEventListener("click", () => {
    gravityOn = !gravityOn;
    gravBtn.textContent = gravityOn ? "Gravity: ON" : "Gravity: OFF";
    gravBtn.classList.toggle("active", gravityOn);
  });

  pulseBtn.addEventListener("click", () => {
    balls.forEach((b) => {
      b.vx += (Math.random() - 0.5) * 260;
      b.vy -= 180;
    });
    pendBob.vx += 160;
  });

  resetBtn.addEventListener("click", seed);

  function stepPhysics() {
    const dt = 1 / 60;
    const g = gravityOn ? 420 : 0;
    const w = canvas.width, hPx = canvas.height;
    const all = [...balls, pendBob];

    for (const b of all) {
      b.vy += g * dt;
      b.vx *= 0.996;
      b.vy *= 0.996;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
    }

    for (let k = 0; k < 5; k++) {
      const dx = pendBob.x - anchor.x;
      const dy = pendBob.y - anchor.y;
      const dist = Math.hypot(dx, dy) || 1;
      const diff = (dist - anchor.len) / dist;
      pendBob.x -= dx * diff;
      pendBob.y -= dy * diff;
      pendBob.vx -= (dx * diff) * 0.8;
      pendBob.vy -= (dy * diff) * 0.8;
    }

    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const a = all[i], b = all[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const minDist = a.r + b.r;
        const dist = Math.hypot(dx, dy);
        if (dist < minDist && dist > 0.001) {
          const nx = dx / dist, ny = dy / dist;
          const overlap = (minDist - dist) * 0.5;
          a.x -= nx * overlap; a.y -= ny * overlap;
          b.x += nx * overlap; b.y += ny * overlap;
          const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
          const vn = rvx * nx + rvy * ny;
          if (vn < 0) {
            const jImp = -0.92 * vn;
            a.vx -= jImp * nx; a.vy -= jImp * ny;
            b.vx += jImp * nx; b.vy += jImp * ny;
          }
        }
      }
    }

    for (const b of all) {
      if (b.x - b.r < 0) { b.x = b.r; b.vx *= -0.86; }
      if (b.x + b.r > w) { b.x = w - b.r; b.vx *= -0.86; }
      if (b.y - b.r < 0) { b.y = b.r; b.vy *= -0.86; }
      if (b.y + b.r > hPx) { b.y = hPx - b.r; b.vy *= -0.86; }
    }

    ctx.fillStyle = "#07080b";
    ctx.fillRect(0, 0, w, hPx);

    ctx.strokeStyle = "rgba(229,192,123,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    ctx.lineTo(pendBob.x, pendBob.y);
    ctx.stroke();
    ctx.fillStyle = "#9ca3af";
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, 4, 0, Math.PI * 2);
    ctx.fill();

    for (const b of all) {
      ctx.fillStyle = b === pendBob ? "#f43f5e" : b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    hud.textContent = `BODIES: ${all.length} · CLICK TO SPAWN`;
    requestAnimationFrame(stepPhysics);
  }
  requestAnimationFrame(stepPhysics);
}

/* ============================================================================
 * 7. PLAYABLE ENGINE 3: GPT-2 ATTENTION & JVM 0xCAFEBABE INSPECTOR
 * ============================================================================ */
function initInspectorWidget() {
  const box = document.getElementById("inspector-box");
  if (!box) return;

  const tokens = ["the", "cat", "sat", "on", "mat"];
  const weights = [
    [1.0, 0, 0, 0, 0],
    [0.34, 0.66, 0, 0, 0],
    [0.14, 0.52, 0.34, 0, 0],
    [0.09, 0.18, 0.44, 0.29, 0],
    [0.08, 0.22, 0.19, 0.35, 0.16]
  ];

  const jvmSteps = [
    { op: "00: iload_0", stack: "[n=6] · load arg" },
    { op: "01: iconst_1 / if_icmple", stack: "6 > 1 · branch false" },
    { op: "08: iload_0 ; iconst_1 ; isub", stack: "[6, 5]" },
    { op: "12: invokestatic fact(I)I", stack: "[6, 120]" },
    { op: "15: imul ; ireturn", stack: "return 720 (PASS)" }
  ];

  const render = (state) => {
    box.innerHTML = "";
    if (state.inspectorTab === "attention") {
      const tokRow = document.createElement("div");
      tokRow.className = "token-row";
      tokens.forEach((tok, idx) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "tok-btn" + (idx === state.selectedToken ? " active" : "");
        b.textContent = tok;
        b.addEventListener("click", () => store.dispatch({ type: "SELECT_TOKEN", index: idx }));
        tokRow.appendChild(b);
      });

      const bars = document.createElement("div");
      bars.className = "attn-bars";
      const rowW = weights[state.selectedToken];
      tokens.forEach((tok, idx) => {
        const pct = Math.round(rowW[idx] * 100);
        const r = document.createElement("div");
        r.className = "attn-row";
        r.innerHTML = `<span>${tok}</span><div class="attn-track"><div class="attn-fill" style="width:${pct}%"></div></div><span>${idx > state.selectedToken ? "MASK" : pct + "%"}</span>`;
        bars.appendChild(r);
      });
      box.appendChild(tokRow);
      box.appendChild(bars);
    } else {
      const list = document.createElement("div");
      list.className = "jvm-list";
      jvmSteps.forEach((st, idx) => {
        const row = document.createElement("div");
        row.className = "jvm-step" + (idx === state.jvmStep ? " active" : "");
        row.innerHTML = `<span>${st.op}</span><span>${st.stack}</span>`;
        row.addEventListener("click", () => store.dispatch({ type: "STEP_JVM", step: idx }));
        list.appendChild(row);
      });
      box.appendChild(list);
    }
  };

  document.querySelectorAll("[data-inspector]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-inspector");
      document.querySelectorAll("[data-inspector]").forEach((b) => b.classList.toggle("active", b === btn));
      store.dispatch({ type: "SET_INSPECTOR_TAB", tab });
    });
  });

  render(store.getState());
  store.subscribe((state, action) => {
    if (["SET_INSPECTOR_TAB", "SELECT_TOKEN", "STEP_JVM"].includes(action.type)) {
      render(state);
    }
  });
}

/* ============================================================================
 * 8. REPOS MODAL, CV MODAL & COPY
 * ============================================================================ */
function initModalsAndExtras() {
  const toast = document.getElementById("toast");
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { toast.hidden = true; }, 2200);
  };

  document.querySelectorAll(".copy-trigger").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const val = btn.getAttribute("data-copy");
      if (!val) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(val);
      } catch {}
      showToast(`Copied: ${val}`);
    });
  });

  const reposModal = document.getElementById("repos-modal");
  const openRepos = document.getElementById("open-repos-btn");
  const closeRepos = document.getElementById("close-repos-btn");
  const filterBar = document.getElementById("repos-filter-bar");
  const reposGrid = document.getElementById("repos-grid");
  let activeLang = "All";

  const drawRepos = () => {
    if (!reposGrid) return;
    reposGrid.innerHTML = "";
    const items = activeLang === "All" ? LAB_PROJECTS : LAB_PROJECTS.filter((p) => p.lang === activeLang);
    items.forEach((p) => {
      const el = document.createElement("div");
      el.className = "repo-tile";
      el.innerHTML = `<div><span>#${String(p.id).padStart(3, "0")} · ${p.lang.toUpperCase()}</span><h4>${p.title}</h4></div><a class="mini-link" href="${p.url}" target="_blank" rel="noopener noreferrer">GitHub &nearr;</a>`;
      reposGrid.appendChild(el);
    });
  };

  if (filterBar) {
    ["All", "Python", "JavaScript", "Node.js", "Java", "OCaml", "Nim"].forEach((lang) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ctrl-btn" + (lang === "All" ? " active" : "");
      b.textContent = lang;
      b.addEventListener("click", () => {
        activeLang = lang;
        filterBar.querySelectorAll(".ctrl-btn").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        drawRepos();
      });
      filterBar.appendChild(b);
    });
    drawRepos();
  }

  if (openRepos && reposModal) {
    openRepos.addEventListener("click", () => { reposModal.hidden = false; });
    closeRepos.addEventListener("click", () => { reposModal.hidden = true; });
    reposModal.addEventListener("click", (e) => { if (e.target === reposModal) reposModal.hidden = true; });
  }

  const cvModal = document.getElementById("cv-modal");
  const cvClose = document.getElementById("close-cv-btn");
  const cvPrint = document.getElementById("print-cv-btn");
  ["open-cv-btn", "open-cv-hero", "open-cv-footer"].forEach((id) => {
    const el = document.getElementById(id);
    if (el && cvModal) el.addEventListener("click", () => { cvModal.hidden = false; });
  });
  if (cvClose && cvModal) cvClose.addEventListener("click", () => { cvModal.hidden = true; });
  if (cvPrint) cvPrint.addEventListener("click", () => window.print());
  if (cvModal) cvModal.addEventListener("click", (e) => { if (e.target === cvModal) cvModal.hidden = true; });
}

/* ============================================================================
 * 9. BOOTSTRAP
 * ============================================================================ */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".pill-filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.getAttribute("data-bento");
        document.querySelectorAll(".pill-filter").forEach((b) => b.classList.toggle("active", b === btn));
        store.dispatch({ type: "FILTER_BENTO", filter: f });
      });
    });

    store.subscribe((state, action) => {
      if (["SWITCH_PERSONA", "FILTER_BENTO", "SET_RENDER_3D", "SET_INSPECTOR_TAB", "SELECT_TOKEN", "STEP_JVM", "TOGGLE_VDOM_TREE"].includes(action.type)) {
        renderBentoAndTelemetry(state);
      }
    });

    renderBentoAndTelemetry(store.getState());
    initHeroCards();
    init3DRasterizer();
    init2DPhysics();
    initInspectorWidget();
    initModalsAndExtras();
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { h, createStore, portfolioReducer, BENTO_FRAMES, LAB_PROJECTS };
}
