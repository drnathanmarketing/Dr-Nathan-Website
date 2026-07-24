/**
 * Motion system for the private /credentials pitch page.
 *
 * Kept separate from `animations.ts` (which the marketing site depends on) so
 * the pitch can carry a bolder, more expressive motion identity without
 * destabilising the landing page.
 *
 * ── Brand motion identity ────────────────────────────────────────────────
 * One archetype, applied consistently — the previous pass failed because
 * every section ran the same fade-and-rise, which reads as a template no
 * matter how bold the individual numbers are.
 *
 *   Personality   Premium. Controlled, unhurried, zero overshoot. The page
 *                 sells clinical precision, so nothing bounces or wobbles.
 *   Signature     `dnm` — one curve drives ~80% of the page.
 *   Durations     DUR.quick / base / slow / epic. Components never invent
 *                 their own numbers; that is how a palette drifts.
 *   Entrance      Masked rise. Content emerges from behind a hard edge
 *                 rather than fading in place — fades read as cheap.
 *
 * Every section composes three layers: primary (the content), secondary
 * (rules, indices, counters) and ambient (parallax, drift). A section with
 * only a primary layer is what makes motion feel flat.
 *
 * Uses SplitText rather than the hand-rolled splitter it replaces. That is a
 * correctness fix as much as an aesthetic one: SplitText re-splits when web
 * fonts finish loading and when the element is resized (`autoSplit`), and
 * keeps an `aria-label` on the source element so screen readers still read a
 * sentence instead of a stream of single characters.
 */
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

export { gsap, ScrollTrigger, SplitText };

/* ── Identity constants ──────────────────────────────────────────────────── */

// Registered once by name; tweens reference the string, e.g. ease: EASE.signature
CustomEase.create("dnm", "0.16, 1, 0.3, 1"); // premium decelerate — entrances
CustomEase.create("dnm-io", "0.76, 0, 0.24, 1"); // symmetric — on-screen moves
CustomEase.create("dnm-exit", "0.6, 0, 0.98, 0.4"); // accelerate — exits

export const EASE = {
  signature: "dnm",
  inOut: "dnm-io",
  exit: "dnm-exit",
  linear: "none",
} as const;

/** Duration palette. Distance scales these; see `motion-design` duration table. */
export const DUR = {
  quick: 0.24,
  base: 0.55,
  slow: 0.9,
  epic: 1.35,
} as const;

/** Stagger budgets — total spread must stay under ~0.5s or the tail feels detached. */
export const STAGGER = {
  tight: 0.035,
  cascade: 0.07,
  dramatic: 0.13,
} as const;

/* ── Environment ─────────────────────────────────────────────────────────── */

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isTouch = (): boolean =>
  typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches;

type Targets = string | Element | Element[] | NodeListOf<Element>;

const toEls = (targets: Targets): HTMLElement[] =>
  gsap.utils.toArray<HTMLElement>(targets as gsap.DOMTarget);

const first = (target: string | HTMLElement | null): HTMLElement | null =>
  typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;

/* ── Text ────────────────────────────────────────────────────────────────── */

interface TextRevealOptions {
  /** Scroll position that fires the reveal. Omit + `immediate` for load-time. */
  start?: string;
  /** Play immediately instead of on scroll (hero / above-the-fold). */
  immediate?: boolean;
  delay?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  /** Slight horizontal drift, so lines arrive on an arc rather than straight up. */
  skew?: number;
  trigger?: HTMLElement | string;
}

/**
 * Signature entrance: text lines rise out of a hard mask edge.
 *
 * Used for headings and lead paragraphs. Line-level (not character-level) is
 * deliberate for prose — per-character reveals on body copy are the single
 * most overused effect on award sites and they hurt readability.
 */
export function revealLines(
  target: string | HTMLElement | null,
  opts: TextRevealOptions = {}
): void {
  const el = first(target);
  if (!el) return;

  const {
    start = "top 82%",
    immediate = false,
    delay = 0,
    duration = DUR.slow,
    stagger = STAGGER.cascade,
    ease = EASE.signature,
    skew = 0,
    trigger,
  } = opts;

  gsap.set(el, { opacity: 1 });

  if (prefersReducedMotion()) return;

  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    linesClass: "pm-line",
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 108,
        skewY: skew,
        duration,
        delay,
        stagger,
        ease,
        ...(immediate
          ? {}
          : { scrollTrigger: { trigger: trigger ?? el, start, once: true } }),
      });
    },
  });
}

/**
 * Character-level masked rise. Reserved for the two or three biggest
 * statements on the page — it loses its impact the moment it is everywhere.
 */
export function revealChars(
  target: string | HTMLElement | null,
  opts: TextRevealOptions = {}
): void {
  const el = first(target);
  if (!el) return;

  const {
    start = "top 82%",
    immediate = false,
    delay = 0,
    duration = DUR.epic,
    stagger = 0.018,
    ease = EASE.signature,
    trigger,
  } = opts;

  gsap.set(el, { opacity: 1 });

  if (prefersReducedMotion()) return;

  SplitText.create(el, {
    type: "chars, words, lines",
    mask: "lines",
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.chars, {
        yPercent: 120,
        duration,
        delay,
        stagger: { each: stagger, from: "start" },
        ease,
        ...(immediate
          ? {}
          : { scrollTrigger: { trigger: trigger ?? el, start, once: true } }),
      });
    },
  });
}

interface StatementOptions {
  start?: string;
  end?: string;
  dim?: number;
}

/**
 * Scroll-scrubbed word illumination — the reader's own scrolling lights the
 * sentence up word by word. A "hold" moment: use once, on the line that
 * matters most.
 */
export function statementScrub(
  target: string | HTMLElement | null,
  opts: StatementOptions = {}
): void {
  const el = first(target);
  if (!el) return;
  const { start = "top 80%", end = "bottom 60%", dim = 0.16 } = opts;

  gsap.set(el, { opacity: 1 });
  if (prefersReducedMotion()) return;

  SplitText.create(el, {
    type: "words",
    autoSplit: true,
    onSplit(self) {
      gsap.set(self.words, { opacity: dim });
      return gsap.to(self.words, {
        opacity: 1,
        ease: EASE.linear,
        stagger: 1,
        scrollTrigger: { trigger: el, start, end, scrub: true },
      });
    },
  });
}

/* ── Blocks ──────────────────────────────────────────────────────────────── */

interface StackOptions {
  y?: number;
  x?: number;
  scale?: number;
  rotate?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  /** Stagger origin — "start" | "end" | "center" | "edges" | index. */
  from?: gsap.StaggerVars["from"];
}

/**
 * Reveal a group of blocks (cards, rows, cells) as one batch.
 *
 * Unlike the old single-signature reveal, callers are expected to vary `y`,
 * `x`, `scale`, `rotate` and `from` per section — that variation is what
 * stops the page reading as one repeated effect.
 */
export function revealStack(targets: Targets, opts: StackOptions = {}): void {
  const els = toEls(targets);
  if (!els.length) return;

  const {
    y = 44,
    x = 0,
    scale = 1,
    rotate = 0,
    duration = DUR.slow,
    stagger = STAGGER.cascade,
    ease = EASE.signature,
    start = "top 85%",
    from = "start",
  } = opts;

  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 });
    return;
  }

  gsap.set(els, { opacity: 0, y, x, scale, rotate, willChange: "transform, opacity" });
  ScrollTrigger.batch(els, {
    start,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotate: 0,
        duration,
        stagger: { each: stagger, from },
        ease,
        overwrite: true,
        clearProps: "willChange",
      }),
  });
}

/* ── Secondary layer ─────────────────────────────────────────────────────── */

/**
 * Horizontal rule that wipes open from its origin edge.
 *
 * Uses scaleX rather than animating `width`, which the previous pass did —
 * width is a layout property, so every frame forced a reflow of everything
 * after the rule. The transform runs on the compositor instead.
 */
export function wipeRule(targets: Targets, opts: { duration?: number; start?: string; stagger?: number } = {}): void {
  const els = toEls(targets);
  if (!els.length) return;
  const { duration = DUR.epic, start = "top 90%", stagger = STAGGER.cascade } = opts;

  if (prefersReducedMotion()) {
    gsap.set(els, { scaleX: 1 });
    return;
  }

  gsap.set(els, { scaleX: 0 });
  ScrollTrigger.batch(els, {
    start,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { scaleX: 1, duration, stagger, ease: EASE.inOut, overwrite: true }),
  });
}

interface CounterOptions {
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  start?: string;
}

/** Count a number up on scroll-in, easing out so it settles rather than stops. */
export function counter(el: HTMLElement | null, end: number, opts: CounterOptions = {}): void {
  if (!el) return;
  const { duration = 2.1, decimals = 0, prefix = "", suffix = "", start = "top 85%" } = opts;
  const format = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`;

  if (prefersReducedMotion()) {
    el.textContent = format(end);
    return;
  }

  const obj = { val: 0 };
  el.textContent = format(0);
  ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: () =>
      gsap.to(obj, {
        val: end,
        duration,
        ease: EASE.signature,
        onUpdate: () => {
          el.textContent = format(obj.val);
        },
      }),
  });
}

/** Wire every `[data-count-end]` element in a root. */
export function initCounters(root: ParentNode = document, selector = "[data-count-end]"): void {
  root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    counter(el, parseFloat(el.dataset.countEnd ?? "0"), {
      decimals: parseInt(el.dataset.countDecimals ?? "0", 10),
      suffix: el.dataset.countSuffix ?? "",
      prefix: el.dataset.countPrefix ?? "",
    });
  });
}

/* ── Ambient layer ───────────────────────────────────────────────────────── */

interface ParallaxOptions {
  /** Total travel in px across the whole scroll range. Negative moves against scroll. */
  distance?: number;
  trigger?: HTMLElement | string;
  start?: string;
  end?: string;
  scale?: number;
}

/**
 * Scrub an element against scroll to create depth.
 *
 * This is the layer the previous pass was missing entirely. Backgrounds that
 * hold perfectly still behind moving content are what make a page feel flat,
 * regardless of how good the foreground animation is.
 */
export function parallax(targets: Targets, opts: ParallaxOptions = {}): void {
  if (prefersReducedMotion() || isTouch()) return;
  const els = toEls(targets);
  if (!els.length) return;

  const { distance = 120, trigger, start = "top bottom", end = "bottom top", scale } = opts;

  els.forEach((el) => {
    const d = Number(el.dataset.parallax ?? distance);
    gsap.fromTo(
      el,
      { y: -d / 2, ...(scale ? { scale } : {}) },
      {
        y: d / 2,
        ...(scale ? { scale: 1 } : {}),
        ease: EASE.linear,
        scrollTrigger: {
          trigger: trigger ?? el.parentElement ?? el,
          start,
          end,
          scrub: true,
        },
      }
    );
  });
}

/**
 * Endless, non-repeating drift for decorative shapes. Each element gets its
 * own duration and phase so the group never visibly syncs up.
 */
export function drift(targets: Targets, opts: { amount?: number; duration?: number } = {}): void {
  if (prefersReducedMotion()) return;
  const els = toEls(targets);
  if (!els.length) return;
  const { amount = 30, duration = 9 } = opts;

  els.forEach((el, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    gsap.to(el, {
      x: `+=${amount * dir}`,
      y: `+=${amount * 0.6 * dir}`,
      duration: duration + i * 2.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  });
}

/* ── Marquee ─────────────────────────────────────────────────────────────── */

/**
 * Drive marquee rows with GSAP and react to scroll velocity — rows skew and
 * surge while the visitor scrolls, then settle. Each row's `.marquee-inner`
 * must contain its content duplicated once so -50% loops seamlessly.
 * `data-reverse` flips a row; `data-slow` slows it.
 */
export function velocityMarquee(
  rows: HTMLElement[],
  opts: { speed?: number } = {}
): (() => void) | void {
  if (prefersReducedMotion() || !rows.length) return;
  const { speed = 22 } = opts;

  const loops = rows.map((row) => {
    const inner = row.querySelector<HTMLElement>(".marquee-inner");
    if (!inner) return null;
    const reverse = row.dataset.reverse !== undefined;
    gsap.set(inner, { xPercent: reverse ? -50 : 0 });
    return gsap.to(inner, {
      xPercent: reverse ? 0 : -50,
      duration: speed * (row.dataset.slow ? 1.5 : 1),
      ease: EASE.linear,
      repeat: -1,
    });
  });

  const setters = rows.map((row) => {
    const inner = row.querySelector<HTMLElement>(".marquee-inner");
    return inner ? gsap.quickTo(inner, "skewX", { duration: 0.4, ease: "power3" }) : null;
  });

  const clampSkew = gsap.utils.clamp(-14, 14);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  const st = ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity();
      setters.forEach((s) => s?.(clampSkew(v / -70)));
      loops.forEach((l) => l?.timeScale(1 + Math.min(4, Math.abs(v) / 320)));
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        setters.forEach((s) => s?.(0));
        loops.forEach((l) => l?.timeScale(1));
      }, 120);
    },
  });

  return () => {
    clearTimeout(resetTimer);
    st.kill();
    loops.forEach((l) => l?.kill());
  };
}
