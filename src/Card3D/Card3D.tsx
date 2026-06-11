import React, { useCallback, useEffect, useRef } from 'react';

export interface Card3DProps {
  /** Slot — card contents. Descendants with a z-pos="N" attribute float N px toward the viewer. */
  slot?: React.ReactNode;
  /** Maximum tilt angle in degrees at the corners (default: 8). */
  tiltAmount?: number;
  /** CSS perspective in pixels (default: 1000). Lower = more dramatic 3D. */
  perspective?: number;
  /** Multiplier applied to every z-pos value (default: 1). */
  zScale?: number;
  /** Smoothing duration in ms while tracking the mouse (default: 80). */
  followDuration?: number;
  /** Duration in ms for the card to return to flat after the mouse leaves (default: 400). */
  resetDuration?: number;
  /** CSS easing function for the reset transition (default: 'ease-out'). */
  resetEasing?: string;
}

// CSS marker we set on ancestors so we can clean up later without disturbing
// preserve-3d that the user authored themselves.
const PRESERVE_3D_MARKER = 'data-sygnal-3d-card-preserve';

// Find every element under the slotted light DOM that carries a z-pos attribute.
// We check both the assigned elements themselves and their descendants.
function collectZPosElements(slot: HTMLSlotElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  slot.assignedElements().forEach((root) => {
    if (!(root instanceof HTMLElement)) return;
    if (root.hasAttribute('z-pos')) out.push(root);
    root.querySelectorAll<HTMLElement>('[z-pos]').forEach((el) => out.push(el));
  });
  return out;
}

export const Card3D: React.FC<Card3DProps> = ({
  slot,
  tiltAmount = 8,
  perspective = 1000,
  zScale = 1,
  followDuration = 80,
  resetDuration = 400,
  resetEasing = 'ease-out',
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // -----------------------------------------------------------------------
  // Apply translateZ to every [z-pos] element under the slot, and propagate
  // transform-style: preserve-3d up the light-DOM chain so the lift is
  // actually rendered in 3D space rather than flattened.
  // -----------------------------------------------------------------------
  const applyZPos = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    const slotEl = card.querySelector('slot') as HTMLSlotElement | null;
    if (!slotEl) return;
    // The slot element itself sits between the card and the projected
    // light DOM in the flat tree, so it also needs preserve-3d.
    slotEl.style.transformStyle = 'preserve-3d';

    const root = card.getRootNode();
    const host = root instanceof ShadowRoot ? (root.host as HTMLElement) : null;

    collectZPosElements(slotEl).forEach((el) => {
      const raw = parseFloat(el.getAttribute('z-pos') || '0');
      const z = Number.isFinite(raw) ? raw * zScale : 0;
      el.style.transform = `translateZ(${z}px)`;
      el.style.transformStyle = 'preserve-3d';

      // Walk up the light DOM to the host, marking each ancestor preserve-3d
      // so its descendants are kept in 3D space rather than flattened.
      let cursor: HTMLElement | null = el.parentElement;
      while (cursor && cursor !== host) {
        if (!cursor.hasAttribute(PRESERVE_3D_MARKER)) {
          cursor.setAttribute(PRESERVE_3D_MARKER, '');
          cursor.style.transformStyle = 'preserve-3d';
        }
        cursor = cursor.parentElement;
      }
    });
  }, [zScale]);

  // Re-apply on mount and whenever slotted content changes.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const slotEl = card.querySelector('slot') as HTMLSlotElement | null;
    if (!slotEl) return;

    applyZPos();
    slotEl.addEventListener('slotchange', applyZPos);
    return () => slotEl.removeEventListener('slotchange', applyZPos);
  }, [applyZPos]);

  // -----------------------------------------------------------------------
  // Mouse handlers
  //
  // Attached natively rather than through React's onMouseMove / onMouseLeave
  // props. The slot's projected content lives in light DOM as children of
  // the <code-island> host. Mouse events on that content bubble through the
  // slot's composed path and DO pass through this wrapper at the DOM level,
  // but React's synthetic event system walks parentNode (not composedPath)
  // from event.target. That parent chain goes from `.bh-card` to the host
  // and never crosses into our shadow-root wrapper, so a React-bound handler
  // would never fire when the user moused over their slotted content.
  // Native addEventListener on the wrapper sees the composed bubble path.
  // -----------------------------------------------------------------------
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    if (!wrapper || !card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // nx, ny in [-1, 1] — origin at card center, -1 = left/top edge.
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Mouse at the top (ny<0) → rotateX<0 tilts the top toward the viewer.
      // Mouse at the left (nx<0) → rotateY>0 tilts the left toward the viewer.
      const rotX = ny * tiltAmount;
      const rotY = -nx * tiltAmount;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        card.style.transition = `transform ${followDuration}ms linear`;
        card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
    };

    const handleMouseLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      card.style.transition = `transform ${resetDuration}ms ${resetEasing}`;
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tiltAmount, followDuration, resetDuration, resetEasing]);

  return (
    <div
      ref={wrapperRef}
      style={{
        display: 'block',
        perspective: `${perspective}px`,
      }}
    >
      <div
        ref={cardRef}
        style={{
          display: 'block',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transition: `transform ${resetDuration}ms ${resetEasing}`,
        }}
      >
        {slot}
      </div>
    </div>
  );
};
