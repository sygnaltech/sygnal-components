import React, { useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
//import MasonryLayout from "masonry-layout";

// https://masonry.desandro.com/#package-managers 

interface MasonryProps {
  slot?: React.ReactNode;    
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

export const Masonry = ({ slot }: MasonryProps) => {
  const componentId = useMemo(() => `id-${uuidv4()}`, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<any>(null); // cannot type it before import

  const cleanedSlot = useMemo(() => {
    const unwrapTargets = new Set(["w-dyn-list", "w-dyn-items", "w-dyn-item"]);
    return unwrap(slot ?? null, unwrapTargets);
  }, [slot]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let imgs: HTMLImageElement[] = [];

    (async () => {
      const MasonryLayout = (await import("masonry-layout")).default;

      masonryRef.current?.destroy?.();
      masonryRef.current = new MasonryLayout(el, {
        itemSelector: ":scope > *",
      });

      imgs = Array.from(el.querySelectorAll("img"));
      const onLoad = () => masonryRef.current?.layout?.();

      imgs.forEach((img) => {
        if (img.complete) return;
        img.addEventListener("load", onLoad);
        img.addEventListener("error", onLoad);
      });

      masonryRef.current.layout?.();
    })();

    return () => {
      imgs.forEach((img) => {
        img.removeEventListener("load", () => {});
        img.removeEventListener("error", () => {});
      });
      masonryRef.current?.destroy?.();
      masonryRef.current = null;
    };
  }, [cleanedSlot]);

  return (
    <div id={componentId} ref={containerRef}>
      {cleanedSlot}
    </div>
  );
};


// const unwrap = (
//   nodes: React.ReactNode,
//   classNamesToUnwrap: Set<string>
// ): React.ReactNode => {
//   if (Array.isArray(nodes)) return nodes.map((n) => unwrap(n, classNamesToUnwrap));
//   if (React.isValidElement(nodes)) {
//     const className = nodes.props.className ?? "";
//     const classes = className.split(" ");
//     const match = classes.find((cls) => classNamesToUnwrap.has(cls));
//     if (match) return unwrap(nodes.props.children, classNamesToUnwrap);
//     return React.cloneElement(nodes, {
//       ...nodes.props,
//       children: unwrap(nodes.props.children, classNamesToUnwrap),
//     });
//   }
//   return nodes;
// };

// export const Masonry = ({ slot }: MasonryProps) => {
//   const componentId = useMemo(() => `id-${uuidv4()}`, []);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const masonryRef = useRef<InstanceType<typeof MasonryLayout> | null>(null);

//   const cleanedSlot = useMemo(() => {
//     const unwrapTargets = new Set(["w-dyn-list", "w-dyn-items", "w-dyn-item"]);
//     return unwrap(slot ?? null, unwrapTargets);
//   }, [slot]);

//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;

//     // Destroy any existing instance before creating a new one
//     masonryRef.current?.destroy?.();
//     masonryRef.current = new MasonryLayout(el, {
//       itemSelector: ":scope > *",
//     });

//     // If images inside items, re-layout after they load
//     const imgs = Array.from(el.querySelectorAll("img"));
//     const onLoad = () => masonryRef.current?.layout?.();
//     imgs.forEach((img) => {
//       if (img.complete) return;
//       img.addEventListener("load", onLoad);
//       img.addEventListener("error", onLoad);
//     });

//     // Initial layout after mount
//     masonryRef.current.layout?.();

//     return () => {
//       imgs.forEach((img) => {
//         img.removeEventListener("load", onLoad);
//         img.removeEventListener("error", onLoad);
//       });
//       masonryRef.current?.destroy?.();
//       masonryRef.current = null;
//     };
//   }, [cleanedSlot]);

//   return (
//     <div id={componentId} ref={containerRef}>
//       {cleanedSlot}
//     </div>
//   );
// };

/*
// Utility to recursively unwrap nodes with target classNames
const unwrap = (
  nodes: React.ReactNode,
  classNamesToUnwrap: Set<string>
): React.ReactNode => {
  if (Array.isArray(nodes)) {
    return nodes.map((node) => unwrap(node, classNamesToUnwrap));
  }

  if (React.isValidElement(nodes)) {
    const className = nodes.props.className ?? "";

    // If current element should be unwrapped
    const classes = className.split(" ");
    const match = classes.find((cls) => classNamesToUnwrap.has(cls));

    if (match) {
      // Recursively unwrap its children instead
      return unwrap(nodes.props.children, classNamesToUnwrap);
    }

    // Otherwise clone the element and recursively process its children
    return React.cloneElement(nodes, {
      ...nodes.props,
      children: unwrap(nodes.props.children, classNamesToUnwrap),
    });
  }

  return nodes; // Return text nodes, null, etc.
};

export const Masonry = ({ slot }: MasonryProps) => {
  const componentId = useMemo(() => `id-${uuidv4()}`, []);
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanedSlot = useMemo(() => {
    const unwrapTargets = new Set(["w-dyn-list", "w-dyn-items", "w-dyn-item"]);
    return unwrap(slot, unwrapTargets);
  }, [slot]);


  useEffect(() => {
    if (!containerRef.current) return;

console.log("init masonry")

    import("masonry-layout").then(({ default: MasonryLayout }) => {
      const masonry = new MasonryLayout(containerRef.current!, {
        itemSelector: ":scope > *",
      });

      // Optional: destroy on unmount
      // return () => {
      //   masonry.destroy?.();
      // };
    });
  }, [cleanedSlot]);

  
  
  // new MasonryLayout( `#${componentId}`, {
  //   itemSelector: `#${componentId} *`
  // });

  return (

    // Unwrap collection lists 
    // In the slot content remove any immediate child with a class of w-dyn-list
    // Then remove any immediate child with a class of w-dyn-items
    // Then remove any immediate children with a class of w-dyn-item
    // At each step, keep the children intact, just unwrap 

    <div id={componentId} ref={containerRef}>
      {cleanedSlot}
    </div>

  )

}
*/ 