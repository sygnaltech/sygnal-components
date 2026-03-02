import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// Module-level globals — shared across all Dropdown instances in the bundle
// ---------------------------------------------------------------------------

// Monotonic counter: each newly opened dropdown gets the next z-index value,
// ensuring the most recently opened panel is always on top.
let _zIndexCounter = 1000;
const _getNextZIndex = () => ++_zIndexCounter;

// Reference-counted global listeners.
// document listeners are attached only while at least one dropdown is open,
// and removed when all dropdowns close, preventing memory leaks.
let _openCount = 0;

const _handleGlobalMouseDown = (e: MouseEvent) => {
  // composedPath() crosses Shadow DOM boundaries, so data-sygnal-dropdown on
  // any ancestor wrapper (at any nesting level) will prevent a closeAll.
  const inside = e.composedPath().some(
    (el) => el instanceof Element && el.hasAttribute('data-sygnal-dropdown')
  );
  if (!inside) {
    window.dispatchEvent(new CustomEvent('dropdown:closeAll'));
  }
};

const _handleGlobalKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    window.dispatchEvent(new CustomEvent('dropdown:closeAll'));
  }
};

const _incrementOpen = () => {
  if (++_openCount === 1) {
    document.addEventListener('mousedown', _handleGlobalMouseDown);
    document.addEventListener('keydown', _handleGlobalKeyDown);
  }
};

const _decrementOpen = () => {
  if (--_openCount <= 0) {
    _openCount = 0;
    document.removeEventListener('mousedown', _handleGlobalMouseDown);
    document.removeEventListener('keydown', _handleGlobalKeyDown);
  }
};

// ---------------------------------------------------------------------------
// Depth detection
// ---------------------------------------------------------------------------

// Walks the composed tree upward to count how many ancestor Dropdown
// wrappers contain this instance. Returns 1 for a top-level dropdown,
// 2 for first-nested, 3 for second-nested, and so on.
//
// Each Webflow code component lives in its own shadow root. To cross
// shadow boundaries we use element.assignedSlot, which is set on any
// light-DOM element that has been distributed into a <slot>.
function computeDropdownDepth(wrapper: HTMLElement): number {
  let depth = 1;

  // Step out of our own shadow root to reach the host custom element.
  const ownRoot = wrapper.getRootNode();
  if (!(ownRoot instanceof ShadowRoot)) return depth;
  let node: Element = ownRoot.host;

  while (node) {
    // Walk up the light DOM to find the nearest element distributed into a slot.
    let el: Element | null = node;
    let assignedSlot: HTMLSlotElement | null = null;
    while (el) {
      const slot = (el as HTMLElement).assignedSlot;
      if (slot) { assignedSlot = slot; break; }
      el = el.parentElement;
    }
    if (!assignedSlot) break; // Reached the top of the light DOM tree — stop.

    // Check if this slot is inside a data-sygnal-dropdown shadow tree.
    let ancestor: Element | null = assignedSlot.parentElement;
    let foundDropdown = false;
    while (ancestor) {
      if (ancestor.hasAttribute('data-sygnal-dropdown')) {
        depth++;
        foundDropdown = true;
        break;
      }
      ancestor = ancestor.parentElement;
    }
    if (!foundDropdown) break;

    // Step out of the parent dropdown's shadow root and keep walking up.
    const parentRoot = assignedSlot.getRootNode();
    if (!(parentRoot instanceof ShadowRoot)) break;
    node = parentRoot.host;
  }

  return depth;
}

// ---------------------------------------------------------------------------
// Lookup tables
// ---------------------------------------------------------------------------

type Position = 'below' | 'above' | 'right-down' | 'right-up' | 'left-down' | 'left-up';

// Chevron closed-state rotation in degrees. Open = closed + 180.
const CHEVRON_CLOSED_DEG: Record<Position, number> = {
  'below':      0,
  'above':      180,
  'right-down': -90,
  'right-up':   -90,
  'left-down':  90,
  'left-up':    90,
};

// ---------------------------------------------------------------------------
// Props interface
// ---------------------------------------------------------------------------

export interface DropdownProps {
  /** TextNode — inline-editable label on the Webflow canvas */
  label?: React.ReactNode;
  /** Optional leading icon */
  icon?: { src: string; alt?: string };
  /** Direction the panel expands relative to the trigger (default: 'below') */
  position?: Position;
  /** true = hover trigger, false = click trigger (default: false) */
  openOnHover?: boolean;
  /** Milliseconds before the panel closes after hover leave (default: 150) */
  hoverCloseDelay?: number;
  /** Enable opacity fade transition (default: true) */
  fadeEnabled?: boolean;
  /** Fade transition duration in ms (default: 200) */
  fadeDuration?: number;
  /** CSS easing for fade (default: 'ease') */
  fadeEasing?: string;
  /** Force panel open for Webflow designer preview (default: false) */
  designMode?: boolean;
  /** Slot — dropdown panel contents */
  content?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  icon,
  position = 'below',
  openOnHover = false,
  hoverCloseDelay = 150,
  fadeEnabled = true,
  fadeDuration = 200,
  fadeEasing = 'ease',
  designMode = false,
  content,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [panelZIndex, setPanelZIndex] = useState(1000);
  const [depth, setDepth] = useState(1);
  const [panelPos, setPanelPos] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCheckRef = useRef<((e: MouseEvent) => void) | null>(null);

  // --- Effect A: subscribe to the global closeAll broadcast ---
  useEffect(() => {
    const handleCloseAll = () => setIsOpen(false);
    window.addEventListener('dropdown:closeAll', handleCloseAll);
    return () => window.removeEventListener('dropdown:closeAll', handleCloseAll);
  }, []);

  // --- Effect B: maintain global open count + assign z-index on open ---
  useEffect(() => {
    if (isOpen) {
      setPanelZIndex(_getNextZIndex());
      _incrementOpen();
    } else {
      _decrementOpen();
    }
  }, [isOpen]);

  // --- Effect C: sync designMode → isOpen ---
  useEffect(() => {
    setIsOpen(!!designMode);
  }, [designMode]);

  // --- Effect D: compute nesting depth once on mount ---
  useEffect(() => {
    if (wrapperRef.current) {
      setDepth(computeDropdownDepth(wrapperRef.current));
    }
  }, []);

  // --- Cleanup on unmount: cancel hover timer, release open count if needed ---
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (hoverCheckRef.current) document.removeEventListener('mouseover', hoverCheckRef.current);
      // Use functional update to read current value without adding it as a dep
      setIsOpen((prev) => {
        if (prev) _decrementOpen();
        return false;
      });
    };
  }, []);

  // --- Effect F: calculate panel position in viewport coords (position:fixed) ---
  // Panels use position:fixed so they escape any overflow:hidden ancestor —
  // including their own parent panel when nested dropdowns are open. This lets
  // us add overflow:hidden to panels (needed to clip child backgrounds at the
  // border-radius corners) without clipping sibling/child sub-menus.
  useLayoutEffect(() => {
    if (!isOpen) return;

    const calcPos = (): React.CSSProperties => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return {};
      const r = wrapper.getBoundingClientRect();
      switch (position) {
        case 'below':      return { top: r.bottom,                         left: r.left };
        case 'above':      return { bottom: window.innerHeight - r.top,    left: r.left };
        case 'right-down': return { top: r.top,                            left: r.right };
        case 'right-up':   return { bottom: window.innerHeight - r.bottom, left: r.right };
        case 'left-down':  return { top: r.top,                            right: window.innerWidth - r.left };
        case 'left-up':    return { bottom: window.innerHeight - r.bottom, right: window.innerWidth - r.left };
        default:           return { top: r.bottom,                         left: r.left };
      }
    };

    const update = () => setPanelPos(calcPos());
    update();

    window.addEventListener('scroll', update, { capture: true, passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update, { capture: true });
      window.removeEventListener('resize', update);
    };
  }, [isOpen, position]);

  // --- Effect E: make the Webflow slot wrapper div a flex column,
  //              and forward this panel's border width to nested dropdowns ---
  // Webflow wraps all slotted content in a single light-DOM div. Items inside
  // (links, code-islands, etc.) default to inline/contents and flow horizontally.
  // We find only the slot inside the panel div (not the label slot inside the
  // button) and apply flex-column directly to its assigned wrapper node.
  //
  // We also set --cc-dropdown-_outer-bw on the Webflow wrapper. This custom
  // property cascades through the flat tree to nested code-islands so that their
  // side-expanding panels can offset themselves by the parent panel's border width,
  // ensuring the child's left edge exactly meets the parent's right outer edge.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const slot = panel.querySelector('slot') as HTMLSlotElement | null;
    if (!slot) return;

    // Build the border-width CSS var expression for the current depth level.
    const bwVar = `var(--cc-dropdown-panel-border-width-${depth}, var(--cc-dropdown-panel-border-width, 0px))`;

    const fixLayout = () => {
      slot.assignedElements().forEach((el) => {
        (el as HTMLElement).style.setProperty('display', 'flex', 'important');
        (el as HTMLElement).style.setProperty('flex-direction', 'column', 'important');
        (el as HTMLElement).style.setProperty('--cc-dropdown-_outer-bw', bwVar);
      });
    };

    fixLayout();
    slot.addEventListener('slotchange', fixLayout);
    return () => slot.removeEventListener('slotchange', fixLayout);
  }, [depth]); // Re-run when depth changes so bwVar stays correct

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  const handleClick = () => setIsOpen((prev) => !prev);

  const handleMouseEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Don't start the timer immediately. Instead, check on the next mouseover
    // whether the mouse is still within our dropdown's composed tree.
    // Child submenu panels are positioned outside our panel div's bounds but
    // remain composed descendants of our wrapper (through the slot chain), so
    // composedPath() correctly detects them as "still inside".
    if (hoverCheckRef.current) {
      document.removeEventListener('mouseover', hoverCheckRef.current);
    }
    const check = (e: MouseEvent) => {
      hoverCheckRef.current = null;
      if (!e.composedPath().includes(wrapperRef.current!)) {
        closeTimerRef.current = setTimeout(() => setIsOpen(false), hoverCloseDelay);
      }
    };
    hoverCheckRef.current = check;
    document.addEventListener('mouseover', check, { once: true });
  };

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------

  // Level-aware CSS variable helpers.
  // lv('background', 'none') at depth 2 →
  //   'var(--cc-dropdown-background-2, var(--cc-dropdown-background, none))'
  const lv = (prop: string, fallback: string) =>
    `var(--cc-dropdown-${prop}-${depth}, var(--cc-dropdown-${prop}, ${fallback}))`;

  // lvPad handles the padding-{side} cascade:
  //   level-specific side → global side → level-specific shorthand → global shorthand → hard-coded
  const lvPad = (side: string, fallback: string) =>
    `var(--cc-dropdown-padding-${side}-${depth}, var(--cc-dropdown-padding-${side}, var(--cc-dropdown-padding-${depth}, var(--cc-dropdown-padding, ${fallback}))))`;

  const closedDeg = CHEVRON_CLOSED_DEG[position] ?? 0;
  const chevronDeg = closedDeg + (isOpen ? 180 : 0);
  const transitionValue = fadeEnabled
    ? `opacity ${fadeDuration}ms ${fadeEasing}`
    : 'none';
  const chevronTransition = `transform ${fadeDuration}ms ${fadeEasing}`;

  const hoverHandlers = openOnHover
    ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }
    : {};

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      ref={wrapperRef}
      data-sygnal-dropdown=""
      style={{ position: 'relative', display: 'block', width: 'fit-content' }}
    >
      {/* Trigger button */}
      <button
        {...hoverHandlers}
        onClick={!openOnHover ? handleClick : undefined}
        aria-expanded={isOpen}
        aria-haspopup="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          background: lv('background', 'none'),
          borderStyle: 'solid',
          borderWidth: lv('border-width', '0'),
          borderColor: lv('border-color', 'transparent'),
          borderRadius: lv('border-radius', '0'),
          color: lv('color', 'inherit'),
          paddingTop: lvPad('top', '0.5em'),
          paddingBottom: lvPad('bottom', '0.5em'),
          paddingLeft: lvPad('left', '0.75em'),
          paddingRight: lvPad('right', '0.75em'),
          fontFamily: lv('font-family', 'inherit'),
          fontSize: lv('font-size', 'inherit'),
          lineHeight: lv('line-height', 'inherit'),
        }}
      >
        {icon && (
          <img
            src={icon.src}
            alt={icon.alt ?? ''}
            aria-hidden={!icon.alt}
            style={{
              width: lv('icon-size', '1em'),
              height: lv('icon-size', '1em'),
              objectFit: 'contain',
              flexShrink: 0,
              pointerEvents: 'none',
              marginRight: lv('icon-gap', '0.4em'),
            }}
          />
        )}

        <span style={{ pointerEvents: 'none' }}>
          {label}
        </span>

        {/* Chevron SVG — rotates to indicate direction and open state */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{
            transform: `rotate(${chevronDeg}deg)`,
            transition: chevronTransition,
            flexShrink: 0,
            pointerEvents: 'none',
            marginLeft: lv('chevron-gap', '0.4em'),
          }}
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Panel — always rendered so the fade-out transition fires correctly.
           position:fixed lets it escape overflow:hidden on any ancestor panel,
           so nested sub-menus render correctly while we can still use
           overflow:hidden on this panel to clip child backgrounds at corners. */}
      <div
        ref={panelRef}
        {...hoverHandlers}
        style={{
          position: 'fixed',
          ...panelPos,
          zIndex: panelZIndex,
          display: 'flex',
          flexDirection: 'column',
          width: 'max-content',
          maxWidth: lv('panel-max-width', 'none'),
          overflow: 'hidden',
          background: lv('panel-background', 'none'),
          borderStyle: 'solid',
          borderWidth: lv('panel-border-width', '0'),
          borderColor: lv('panel-border-color', 'transparent'),
          borderRadius: lv('panel-border-radius', '0'),
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: transitionValue,
        }}
      >
        {content}
      </div>
    </div>
  );
};
