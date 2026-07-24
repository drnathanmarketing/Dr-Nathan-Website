/**
 * Interactive "precision grid" canvas background.
 *
 * A matrix of faint dots that softly part and glow around the cursor. Shared by
 * the /credentials gate and the pitch hero so the two screens feel continuous.
 *
 * Degrades deliberately: on touch pointers or under prefers-reduced-motion it
 * paints one still frame and never starts a rAF loop.
 */
import { gsap, prefersReducedMotion } from "./animations";

interface DotGridOptions {
  /** Element whose visibility gates the animation loop (defaults to the canvas). */
  observe?: HTMLElement;
  /** Fade the canvas in on init. */
  fadeIn?: boolean;
}

export function initDotGrid(
  canvas: HTMLCanvasElement | null,
  opts: DotGridOptions = {}
): void {
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  const { observe = canvas, fadeIn = true } = opts;

  const interactive =
    window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion();

  const R = 155;                       // interaction radius
  const BASE_A = 0.14, BASE_R = 1.25;  // resting alpha + radius
  // faint slate-blue → brand primary-400 (#20bdff)
  const C0 = [125, 190, 235] as const;
  const C1 = [32, 189, 255] as const;

  let w = 0, h = 0;
  let dots: { x: number; y: number }[] = [];
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

  function build() {
    const rect = canvas!.getBoundingClientRect();
    w = rect.width; h = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(w * dpr);
    canvas!.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sp = w < 640 ? 30 : 40;
    const cols = Math.ceil(w / sp) + 1;
    const rows = Math.ceil(h / sp) + 1;
    const offX = (w - (cols - 1) * sp) / 2;
    const offY = (h - (rows - 1) * sp) / 2;
    dots = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) dots.push({ x: offX + c * sp, y: offY + r * sp });
  }

  function draw() {
    ctx!.clearRect(0, 0, w, h);
    mouse.x += (mouse.tx - mouse.x) * 0.14;
    mouse.y += (mouse.ty - mouse.y) * 0.14;

    for (const d of dots) {
      const dx = mouse.x - d.x, dy = mouse.y - d.y;
      const dist = Math.hypot(dx, dy);
      let f = 0;
      if (mouse.active && dist < R) {
        const t = 1 - dist / R;
        f = t * t * (3 - 2 * t); // smoothstep
      }
      const nx = dist > 0.001 ? dx / dist : 0;
      const ny = dist > 0.001 ? dy / dist : 0;
      const push = f * 12; // gentle part — keeps the grid orderly
      ctx!.beginPath();
      ctx!.arc(d.x - nx * push, d.y - ny * push, BASE_R + f * 2.4, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${Math.round(C0[0] + f * (C1[0] - C0[0]))},${Math.round(
        C0[1] + f * (C1[1] - C0[1])
      )},${Math.round(C0[2] + f * (C1[2] - C0[2]))},${BASE_A + f * 0.85})`;
      ctx!.fill();
    }
  }

  let raf = 0;
  const loop = () => { draw(); raf = requestAnimationFrame(loop); };
  const start = () => { if (!raf) loop(); };
  const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

  build();
  draw(); // first static paint

  let resizeT: ReturnType<typeof setTimeout>;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { build(); if (!interactive) draw(); }, 150);
  });

  if (!interactive) return; // static faint grid — done

  window.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.tx = e.clientX - rect.left;
    mouse.ty = e.clientY - rect.top;
    if (!mouse.active) { mouse.x = mouse.tx; mouse.y = mouse.ty; mouse.active = true; }
  });
  document.addEventListener("mouseleave", () => {
    mouse.active = false; mouse.tx = -9999; mouse.ty = -9999;
  });

  // Only burn frames while the section is on-screen.
  new IntersectionObserver(
    (entries) => entries.forEach((en) => (en.isIntersecting ? start() : stop())),
    { threshold: 0 }
  ).observe(observe);

  if (fadeIn) {
    gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1.3, ease: "power2.out", delay: 0.2 });
  }
}
