import React, { useEffect, useRef } from 'react';

export type TriggerOption = 'on-view' | 'on-load' | 'manual';
export type EasingOption =
  | 'linear'
  | 'ease-out'
  | 'ease-in-out'
  | 'ease-out-cubic'
  | 'ease-out-expo';
export type SeparatorOption = 'comma' | 'period' | 'space' | 'none' | 'auto';

export interface CountupProps {
  /** Slot — designer-authored markup. Descendants with template="value" become count targets. */
  content?: React.ReactNode;

  // --- Trigger ---
  /** When the count animation fires (default: 'on-view'). */
  trigger?: TriggerOption;
  /** IntersectionObserver visibility ratio, 0–1 (default: 0.3). Only used when trigger is 'on-view'. */
  threshold?: number;
  /** Re-run the animation every time the host re-enters view (default: false). */
  replay?: boolean;
  /** Delay in ms after the trigger fires before counting begins (default: 0). */
  delay?: number;

  // --- Animation ---
  /** Total animation time per element, in ms (default: 2000). */
  duration?: number;
  /** Easing curve (default: 'ease-out-cubic'). */
  easing?: EasingOption;
  /** Delay in ms between successive matched elements (default: 0). */
  stagger?: number;
  /** Skip the animation and write the final value when the OS reports reduced motion (default: true). */
  respectReducedMotion?: boolean;

  // --- Format ---
  /** Starting value for every counter (default: 0). */
  startValue?: number;
  /** Number of decimal places, 0–6 (default: 0). */
  decimals?: number;
  /** Thousands separator (default: 'comma'). */
  separator?: SeparatorOption;
  /** Prepended to the formatted value, e.g. "$" (default: ''). */
  prefix?: string;
  /** Appended to the formatted value, e.g. "+" or "%" (default: ''). */
  suffix?: string;
}

// The custom event a designer dispatches on the host to fire a 'manual' countup.
const MANUAL_EVENT = 'countup:start';

// Selector marking an element inside the slot as a count target.
const TARGET_SELECTOR = '[template="value"]';

const easings: Record<EasingOption, (p: number) => number> = {
  linear: (p) => p,
  'ease-out': (p) => 1 - (1 - p) ** 2,
  'ease-in-out': (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2),
  'ease-out-cubic': (p) => 1 - (1 - p) ** 3,
  'ease-out-expo': (p) => (p === 1 ? 1 : 1 - 2 ** (-10 * p)),
};

// Parse a display string (seed text or data-target) into a number, keeping only
// digits, a decimal point, and a leading minus. Treats '.' as the decimal point,
// so European-format seeds like "13.000" (thirteen thousand) are NOT inferred —
// use data-target in that case.
function parseSeedValue(text: string): number {
  const cleaned = text.replace(/[^0-9.\-]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatValue(
  value: number,
  decimals: number,
  separator: SeparatorOption
): string {
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');

  if (separator === 'none') {
    return decPart ? `${intPart}.${decPart}` : intPart;
  }
  if (separator === 'auto') {
    const grouped = Number(intPart).toLocaleString();
    return decPart ? `${grouped}.${decPart}` : grouped;
  }
  const sepChar = { comma: ',', period: '.', space: ' ' }[separator];
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, sepChar);
  // Decimal separator stays '.' regardless of the thousands separator.
  return decPart ? `${grouped}.${decPart}` : grouped;
}

// Per-element animation config, resolved once at trigger install from the
// component props unioned with the element's own data-* overrides.
interface TargetConfig {
  el: HTMLElement;
  from: number;
  to: number;
  duration: number;
  decimals: number;
  prefix: string;
  suffix: string;
}

function clampDecimals(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(6, Math.round(n)));
}

export const Countup: React.FC<CountupProps> = ({
  content,
  trigger = 'on-view',
  threshold = 0.3,
  replay = false,
  delay = 0,
  duration = 2000,
  easing = 'ease-out-cubic',
  stagger = 0,
  respectReducedMotion = true,
  startValue = 0,
  decimals = 0,
  separator = 'comma',
  prefix = '',
  suffix = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current?.getRootNode();
    const host = root instanceof ShadowRoot ? (root.host as HTMLElement) : null;
    if (!host) return;

    // Resolve every count target and its per-element config once, up front, so
    // replay reuses the same targets/values rather than re-reading text that a
    // prior run has already mutated.
    const targets: TargetConfig[] = Array.from(
      host.querySelectorAll<HTMLElement>(TARGET_SELECTOR)
    ).map((el) => {
      const attr = (name: string) => el.getAttribute(name);

      const dataTarget = attr('data-target');
      const to =
        dataTarget != null
          ? parseSeedValue(dataTarget)
          : parseSeedValue(el.textContent ?? '');

      const dataFrom = attr('data-from');
      const from = dataFrom != null ? parseSeedValue(dataFrom) : startValue;

      const dataDuration = attr('data-duration');
      const dur = dataDuration != null ? parseFloat(dataDuration) : duration;

      const dataDecimals = attr('data-decimals');
      const dec =
        dataDecimals != null ? clampDecimals(parseFloat(dataDecimals)) : clampDecimals(decimals);

      return {
        el,
        from,
        to,
        duration: Number.isFinite(dur) && dur >= 0 ? dur : duration,
        decimals: dec,
        prefix: attr('data-prefix') ?? prefix,
        suffix: attr('data-suffix') ?? suffix,
      };
    });

    const render = (cfg: TargetConfig, value: number) => {
      cfg.el.textContent = `${cfg.prefix}${formatValue(value, cfg.decimals, separator)}${cfg.suffix}`;
    };

    // Reduced motion: write the final value once and never animate.
    if (
      respectReducedMotion &&
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      targets.forEach((cfg) => render(cfg, cfg.to));
      return;
    }

    const rafHandles = new Set<number>();
    const easeFn = easings[easing] ?? easings['ease-out-cubic'];

    const animate = (cfg: TargetConfig, offsetMs: number) => {
      const startTime = performance.now() + offsetMs;
      const step = (now: number) => {
        if (now < startTime) {
          const h = requestAnimationFrame(step);
          rafHandles.add(h);
          return;
        }
        const elapsed = now - startTime;
        const p = cfg.duration <= 0 ? 1 : Math.min(elapsed / cfg.duration, 1);
        const eased = easeFn(p);
        render(cfg, cfg.from + (cfg.to - cfg.from) * eased);
        if (p < 1) {
          const h = requestAnimationFrame(step);
          rafHandles.add(h);
        }
      };
      const h = requestAnimationFrame(step);
      rafHandles.add(h);
    };

    const fire = () => {
      // Cancel any in-flight loops so a replay restarts cleanly from `from`.
      rafHandles.forEach((h) => cancelAnimationFrame(h));
      rafHandles.clear();
      targets.forEach((cfg, i) => animate(cfg, i * stagger + delay));
    };

    // --- Install the trigger ---
    let observer: IntersectionObserver | null = null;

    if (trigger === 'on-load') {
      fire();
    } else if (trigger === 'manual') {
      host.addEventListener(MANUAL_EVENT, fire);
    } else {
      // on-view
      const ratio = Math.max(0, Math.min(1, threshold));
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            fire();
            if (!replay) {
              observer?.disconnect();
              observer = null;
            }
          });
        },
        { threshold: ratio }
      );
      observer.observe(host);
    }

    return () => {
      rafHandles.forEach((h) => cancelAnimationFrame(h));
      rafHandles.clear();
      observer?.disconnect();
      host.removeEventListener(MANUAL_EVENT, fire);
    };
  }, [
    trigger,
    threshold,
    replay,
    delay,
    duration,
    easing,
    stagger,
    respectReducedMotion,
    startValue,
    decimals,
    separator,
    prefix,
    suffix,
  ]);

  // display: contents keeps this wrapper out of layout so the slotted content
  // participates in its grandparent's layout unaltered.
  return (
    <div ref={ref} style={{ display: 'contents' }}>
      {content}
    </div>
  );
};
