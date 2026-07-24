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
