import React, { useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Macy from "macy"; 

interface MasonryProps {
  slot?: React.ReactNode;
  debug?: boolean;
  marginX?: number;
  marginY?: number;
  columns?: number;
  tabletColumns?: number;
  mobileLandscapeColumns?: number;
  mobilePortraitColumns?: number;
  trueOrder?: boolean;
  waitForImages?: boolean;
}


const unwrap = (
  nodes: React.ReactNode,
  classNamesToUnwrap: Set<string>
): React.ReactNode => {
  if (Array.isArray(nodes)) return nodes.map((n) => unwrap(n, classNamesToUnwrap));
  if (React.isValidElement(nodes)) {
    const className = nodes.props.className ?? "";
    const classes = className.split(" ");
    const match = classes.find((cls) => classNamesToUnwrap.has(cls));
    if (match) return unwrap(nodes.props.children, classNamesToUnwrap);
    return React.cloneElement(nodes, {
      ...nodes.props,
      children: unwrap(nodes.props.children, classNamesToUnwrap),
    });
  }
  return nodes;
};

export const Masonry = ({
  slot,
  debug = false,
  marginX = 24,
  marginY = 24,
  columns = 4,
  tabletColumns = 3,
  mobileLandscapeColumns = 2,
  mobilePortraitColumns = 1,
  trueOrder = false,
  waitForImages = false
}: MasonryProps) => {
  const componentId = useMemo(() => `masonry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, []);
  const slotRef = useRef<HTMLElement>(null);
  const masonryRef = useRef<any>(null); // cannot type it before import
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (debug) {
    console.log('=== MASONRY RENDER ===');
    console.log('Component ID:', componentId);
    console.log('Is Client:', isClient);
    console.log('Slot:', slot);
    console.log('Debug:', debug);
    console.log('MarginX:', marginX, 'MarginY:', marginY);
    console.log('Columns:', columns);
    console.log('TabletColumns:', tabletColumns);
    console.log('MobileLandscapeColumns:', mobileLandscapeColumns);
    console.log('MobilePortraitColumns:', mobilePortraitColumns);
    console.log('TrueOrder:', trueOrder);
    console.log('WaitForImages:', waitForImages);
  }

  useEffect(() => {
    if (!isClient) {
      if (debug) console.log('Not on client yet, skipping masonry initialization');
      return;
    }

    const slotElement = slotRef.current;
    if (!slotElement) {
      if (debug) console.log('No slot element found');
      return;
    }

    if (debug) console.log('=== MASONRY INITIALIZATION ===');
    if (debug) console.log('Slot element:', slotElement);

    // First unwrap Webflow collection wrappers in the assigned elements
    const unwrapCollections = () => {
      if (debug) console.log('=== UNWRAPPING COLLECTIONS IN ASSIGNED ELEMENTS ===');

      // Get the assigned elements (content slotted into this slot)
      if ('assignedElements' in slotElement) {
        const assignedElements = (slotElement as any).assignedElements();
        if (debug) console.log('Assigned elements:', assignedElements);

        assignedElements.forEach((assignedEl: Element) => {
          if (debug) console.log('Processing assigned element:', assignedEl);

          const collectionsToUnwrap = assignedEl.querySelectorAll('.w-dyn-list, .w-dyn-items, .w-dyn-item');
          if (debug) console.log('Found collection wrappers in assigned element:', collectionsToUnwrap.length);

          collectionsToUnwrap.forEach((wrapper, index) => {
            // Only log w-dyn-list unwrapping
            if (debug && wrapper.classList.contains('w-dyn-list')) {
              console.log(`Unwrapping collection ${index}:`, wrapper.className);
            }

            // Move all children of the wrapper to replace the wrapper
            const parent = wrapper.parentNode;
            const children = Array.from(wrapper.children);

            if (parent && children.length > 0) {
              // Insert children before the wrapper
              children.forEach(child => {
                parent.insertBefore(child, wrapper);
              });
              // Remove the empty wrapper
              parent.removeChild(wrapper);
            }
          });
        });
      }

      // Remove w-dyn-empty elements after unwrapping
      if ('assignedElements' in slotElement) {
        const assignedElements = (slotElement as any).assignedElements();
        assignedElements.forEach((assignedEl: Element) => {
          const emptyElements = assignedEl.querySelectorAll('.w-dyn-empty');
          emptyElements.forEach((emptyEl) => {
            if (debug) console.log('Removing w-dyn-empty element');
            emptyEl.remove();
          });
        });
      }

      if (debug) console.log('Collection unwrapping complete');
    };

    let imgs: HTMLImageElement[] = [];

    (async () => {
      if (debug) console.log('Loading macy.js...');
      const Macy = (await import("macy")).default;

      if (debug) console.log('Destroying existing macy instance...');
      masonryRef.current?.remove?.();

      // Unwrap collections before initializing masonry
      unwrapCollections();

      // Get the assigned element (the actual content container)
      if ('assignedElements' in slotElement) {
        const assignedElements = (slotElement as any).assignedElements();
        if (assignedElements.length > 0) {
          const contentContainer = assignedElements[0];
          if (debug) console.log('Creating new macy instance with content container:', contentContainer);

          // Build breakpoints object - matching Webflow's breakpoints
          const breakAt: { [key: number]: number } = {
            991: tabletColumns, // Tablet (991px and below)
            767: mobileLandscapeColumns, // Mobile landscape (767px and below)
            478: mobilePortraitColumns // Mobile portrait (478px and below)
          };

          const macyConfig: any = {
            container: contentContainer,
            trueOrder: trueOrder,
            waitForImages: waitForImages,
            margin: {
              x: marginX,
              y: marginY
            },
            columns: columns
          };

          // Always add breakpoints since we have defaults
          macyConfig.breakAt = breakAt;

          if (debug) {
            console.log('Macy config:', macyConfig);
          }

          masonryRef.current = Macy(macyConfig);
        } else {
          if (debug) console.log('No assigned elements found for macy');
        }
      }

      if (debug) console.log('Macy initialization complete');
    })();

    return () => {
      if (debug) console.log('=== MACY CLEANUP ===');
      if (debug) console.log('Destroying macy instance...');
      masonryRef.current?.remove?.();
      masonryRef.current = null;
      if (debug) console.log('Macy cleanup complete');
    };
  }, [debug, isClient, marginX, marginY, columns, tabletColumns, mobileLandscapeColumns, mobilePortraitColumns, trueOrder, waitForImages]);

  if (slot && typeof slot === 'object' && 'type' in slot && slot.type === 'slot') {
    return (
      <div style={{ position: 'relative' }}>
        {React.createElement('slot', {
          ref: slotRef,
          name: slot.props?.name
        })}
        {debug && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px',
            fontSize: '12px',
            zIndex: 1000,
            borderRadius: '4px'
          }}>
            Masonry ID: {componentId}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      Unexpected slot type
    </div>
  );
};

 