/**
 * Shared GSAP animation toolkit for the landing page.
 *
 * Centralises the reveal / kinetic-text / counter patterns that were previously
 * duplicated as inline IntersectionObserver blocks in every section. Follows the
 * repo convention: ease `power3.out`, reveal from { opacity: 0, y: 24–36 }.
 *
 * Everything is guarded for `prefers-reduced-motion` and safe to import from
 * both Astro `<script>` blocks and React islands (Vite dedupes the module and
 * registerPlugin is idempotent).
 */
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

type Targets = string | Element | Element[] | NodeListOf<Element>;

/** True when the visitor asked the OS to minimise motion. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const toEls = (targets: Targets): HTMLElement[] =>
  gsap.utils.toArray<HTMLElement>(targets as gsap.DOMTarget);

interface RevealOptions {
  y?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
}

/**
 * Fade + rise elements into view once, as they cross the viewport.
 * Uses ScrollTrigger.batch so a row of siblings animates together.
 */
export function revealOnScroll(targets: Targets, opts: RevealOptions = {}): void {
  const {
    y = 28,
    opacity = 0,
    duration = 0.9,
    stagger = 0.09,
    delay = 0,
    ease = "power3.out",
    start = "top 85%",
  } = opts;

  const els = toEls(targets);
  if (!els.length) return;

  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: 1, y: 0 });
    return;
  }

  gsap.set(els, { opacity, y, willChange: "transform" });
  ScrollTrigger.batch(els, {
    start,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        delay,
        ease,
        overwrite: true,
        clearProps: "willChange",
      }),
  });
}

/**
 * Split an element's text into per-word inline-block spans (kept in normal flow,
 * so the heading still wraps and left-aligns naturally on every screen size).
 * Returns the word elements so the caller can animate them. Idempotent.
 */
export function splitWords(el: HTMLElement): HTMLElement[] {
  if (!el || el.dataset.split === "done") {
    return Array.from(el?.querySelectorAll<HTMLElement>(".kw-word") ?? []);
  }

  const words = (el.textContent ?? "").trim().split(/\s+/);
  el.textContent = "";
  el.dataset.split = "done";

  const spans: HTMLElement[] = [];
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "kw-word";
    span.style.display = "inline-block";
    span.style.willChange = "transform";
    span.textContent = word;
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    spans.push(span);
  });

  return spans;
}

interface KineticOptions {
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
}

/**
 * Kinetic heading reveal: words fade + rise into place on scroll-in.
 * Falls back to a plain fade under reduced-motion.
 */
export function revealHeading(el: HTMLElement | null, opts: KineticOptions = {}): void {
  if (!el) return;
  const { duration = 0.9, stagger = 0.06, delay = 0, ease = "power4.out", start = "top 85%" } = opts;

  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1 });
    return;
  }

  const words = splitWords(el);
  if (!words.length) {
    gsap.set(el, { opacity: 1 });
    return;
  }

  gsap.set(el, { opacity: 1 });
  gsap.set(words, { opacity: 0, yPercent: 60 });
  ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: () =>
      gsap.to(words, {
        opacity: 1,
        yPercent: 0,
        duration,
        stagger,
        delay,
        ease,
        clearProps: "willChange",
      }),
  });
}

interface CountOptions {
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  start?: string;
}

/** Animate a number from 0 → end once it scrolls into view. */
export function countUp(el: HTMLElement | null, end: number, opts: CountOptions = {}): void {
  if (!el) return;
  const { duration = 2, decimals = 0, prefix = "", suffix = "", start = "top 85%" } = opts;
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
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = format(obj.val);
        },
      }),
  });
}

/**
 * Wire up any element carrying data-count attributes:
 *   data-count-end, data-count-decimals, data-count-suffix, data-count-prefix
 */
export function initCounters(selector = "[data-count-end]"): void {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    countUp(el, parseFloat(el.dataset.countEnd ?? "0"), {
      decimals: parseInt(el.dataset.countDecimals ?? "0", 10),
      suffix: el.dataset.countSuffix ?? "",
      prefix: el.dataset.countPrefix ?? "",
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════
 * Bold kinetic set — used by the private /credentials pitch page for a
 * more expressive, non-corporate feel. Everything degrades to fully-visible
 * static text under prefers-reduced-motion.
 * ═════════════════════════════════════════════════════════════════════ */

/**
 * Split into per-character spans. Each word is kept as one inline-block unit
 * so wrapping still works. With `mask: true` each word becomes an
 * overflow-hidden window (with descender padding) for slide-up "slot" reveals.
 * Returns the character elements. Idempotent.
 */
export function splitChars(el: HTMLElement, opts: { mask?: boolean } = {}): HTMLElement[] {
  if (!el || el.dataset.splitChars === "done") {
    return Array.from(el?.querySelectorAll<HTMLElement>(".kc-char") ?? []);
  }
  const { mask = false } = opts;
  const words = (el.textContent ?? "").trim().split(/\s+/);
  el.textContent = "";
  el.dataset.splitChars = "done";

  const chars: HTMLElement[] = [];
  words.forEach((word, wi) => {
    const wordEl = document.createElement("span");
    wordEl.className = "kc-word";
    wordEl.style.display = "inline-block";
    if (mask) {
      wordEl.style.overflow = "hidden";
      wordEl.style.verticalAlign = "top";
      wordEl.style.paddingBottom = "0.18em";
      wordEl.style.marginBottom = "-0.18em";
    }
    for (const ch of word) {
      const c = document.createElement("span");
      c.className = "kc-char";
      c.style.display = "inline-block";
      c.style.willChange = "transform";
      c.textContent = ch;
      wordEl.appendChild(c);
      chars.push(c);
    }
    el.appendChild(wordEl);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
  });

  return chars;
}

interface KineticCharOptions {
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
  mask?: boolean;
}

/**
 * Bold heading reveal: characters slide up out of a mask on scroll-in,
 * heavier and more deliberate than `revealHeading`. Falls back to a plain
 * appearance under reduced motion.
 */
export function revealHeadingKinetic(el: HTMLElement | null, opts: KineticCharOptions = {}): void {
  if (!el) return;
  const { duration = 0.9, stagger = 0.026, delay = 0, ease = "power4.out", start = "top 85%", mask = true } = opts;

  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1 });
    return;
  }

  const chars = splitChars(el, { mask });
  if (!chars.length) {
    gsap.set(el, { opacity: 1 });
    return;
  }

  gsap.set(el, { opacity: 1 });
  gsap.set(chars, { yPercent: 120, opacity: mask ? 1 : 0 });
  ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: () =>
      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        duration,
        stagger,
        delay,
        ease,
        clearProps: "willChange",
      }),
  });
}

interface HighlightOptions {
  start?: string;
  end?: string;
  dim?: number;
}

/**
 * Scroll-scrubbed word illumination: the words start dimmed and light up one
 * after another, tied to scroll position — a kinetic "statement" moment.
 */
export function scrollHighlightWords(el: HTMLElement | null, opts: HighlightOptions = {}): void {
  if (!el) return;
  const { start = "top 78%", end = "bottom 62%", dim = 0.14 } = opts;

  const words = splitWords(el);
  gsap.set(el, { opacity: 1 });
  if (!words.length) return;

  if (prefersReducedMotion()) {
    gsap.set(words, { opacity: 1 });
    return;
  }

  gsap.set(words, { opacity: dim });
  gsap.to(words, {
    opacity: 1,
    ease: "none",
    stagger: 1,
    scrollTrigger: { trigger: el, start, end, scrub: true },
  });
}

/**
 * Drive a set of marquee rows with GSAP and react to scroll velocity —
 * the rows skew and surge as the visitor scrolls, then settle. Each row's
 * `.marquee-inner` must contain its content duplicated once (so -50% loops
 * seamlessly). `data-reverse` on a row flips its travel direction.
 * Returns a cleanup function; no-op under reduced motion (CSS/static holds).
 */
export function velocityMarquee(rows: HTMLElement[], opts: { speed?: number } = {}): (() => void) | void {
  if (prefersReducedMotion() || !rows.length) return;
  const { speed = 22 } = opts;

  const loops = rows.map((row) => {
    const inner = row.querySelector<HTMLElement>(".marquee-inner");
    if (!inner) return null;
    const reverse = row.dataset.reverse !== undefined;
    const from = reverse ? -50 : 0;
    const to = reverse ? 0 : -50;
    gsap.set(inner, { xPercent: from });
    // Longer rows scroll proportionally slower so linear speed stays even.
    const factor = row.dataset.slow ? 1.5 : 1;
    return gsap.to(inner, {
      xPercent: to,
      duration: speed * factor,
      ease: "none",
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
      const skew = clampSkew(v / -70);
      const boost = 1 + Math.min(4, Math.abs(v) / 320);
      setters.forEach((s) => s?.(skew));
      loops.forEach((l) => l?.timeScale(boost));
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
