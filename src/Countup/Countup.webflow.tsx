import { Countup } from './Countup';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Countup, {
  name: 'Countup',
  description:
    'Animates numeric text in slotted content from a start value up to a target when triggered. Add template="value" to any element that should count.',
  group: 'Interactive',
  props: {
    // -------------------------------------------------------------------------
    // Content
    // -------------------------------------------------------------------------
    content: props.Slot({
      name: 'Content',
      group: 'Content',
      tooltip:
        'Any markup. Elements with a template="value" custom attribute become count targets. Put template="value" on a leaf element (a span around just the number) — the whole element\'s text is replaced while counting.',
    }),

    // -------------------------------------------------------------------------
    // Trigger
    // -------------------------------------------------------------------------
    trigger: props.Variant({
      name: 'Trigger',
      group: 'Trigger',
      options: ['on-view', 'on-load', 'manual'],
      defaultValue: 'on-view',
      tooltip:
        'When the count begins. "on-view" fires when the component scrolls into view; "on-load" fires immediately; "manual" listens for a countup:start CustomEvent on the host element.',
    }),
    threshold: props.Number({
      name: 'View Threshold',
      group: 'Trigger',
      defaultValue: 0.3,
      min: 0,
      max: 1,
      tooltip:
        'Fraction of the component that must be visible to fire (0–1). Only used when Trigger is "on-view".',
    }),
    replay: props.Boolean({
      name: 'Replay On Re-enter',
      group: 'Trigger',
      defaultValue: false,
      tooltip:
        'If on, the count re-runs every time the component re-enters view (or every countup:start event in manual mode). If off, it fires once.',
    }),
    delay: props.Number({
      name: 'Delay (ms)',
      group: 'Trigger',
      defaultValue: 0,
      min: 0,
      tooltip: 'Delay in milliseconds after the trigger fires before counting begins.',
    }),

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------
    duration: props.Number({
      name: 'Duration (ms)',
      group: 'Animation',
      defaultValue: 2000,
      min: 0,
      tooltip: 'Total count time per element, in milliseconds.',
    }),
    easing: props.Variant({
      name: 'Easing',
      group: 'Animation',
      options: ['linear', 'ease-out', 'ease-in-out', 'ease-out-cubic', 'ease-out-expo'],
      defaultValue: 'ease-out-cubic',
      tooltip: 'Easing curve applied to the count. "ease-out-cubic" and "ease-out-expo" decelerate toward the target.',
    }),
    stagger: props.Number({
      name: 'Stagger (ms)',
      group: 'Animation',
      defaultValue: 0,
      min: 0,
      tooltip:
        'Delay in milliseconds between successive matched elements within the slot. Element N starts at N × stagger after the trigger.',
    }),
    respectReducedMotion: props.Boolean({
      name: 'Respect Reduced Motion',
      group: 'Animation',
      defaultValue: true,
      tooltip:
        'If on and the visitor\'s OS requests reduced motion, the animation is skipped and the final value is written immediately.',
    }),

    // -------------------------------------------------------------------------
    // Format
    // -------------------------------------------------------------------------
    startValue: props.Number({
      name: 'Start Value',
      group: 'Format',
      defaultValue: 0,
      tooltip: 'Value every counter animates up from. Override per element with data-from.',
    }),
    decimals: props.Number({
      name: 'Decimal Places',
      group: 'Format',
      defaultValue: 0,
      min: 0,
      max: 6,
      tooltip: 'Number of decimal places (0–6). Override per element with data-decimals.',
    }),
    separator: props.Variant({
      name: 'Thousands Separator',
      group: 'Format',
      options: ['comma', 'period', 'space', 'none', 'auto'],
      defaultValue: 'comma',
      tooltip:
        'Thousands separator. "auto" uses the visitor\'s locale (toLocaleString). The decimal point stays "." regardless.',
    }),
    prefix: props.Text({
      name: 'Prefix',
      group: 'Format',
      defaultValue: '',
      tooltip: 'Text prepended to the value, e.g. "$". Override per element with data-prefix.',
    }),
    suffix: props.Text({
      name: 'Suffix',
      group: 'Format',
      defaultValue: '',
      tooltip: 'Text appended to the value, e.g. "+" or "%". Override per element with data-suffix.',
    }),
  },

  options: {
    // Behavior-only: renders the slot as-is, no tag selectors to apply.
    applyTagSelectors: false,
    // Uses IntersectionObserver, requestAnimationFrame, and DOM mutation — browser only.
    ssr: false,
  },
});
