
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import React from "react";

interface TabsProps {
  position: "Top Left" | "Top Right" | "Left" | "Right" | "Bottom Left" | "Bottom Right"; 
  accordion: "Desktop" | "Tablet" | "Mobile Landscape" | "Mobile Portrait";  
  slot?: React.ReactNode; 
}

// Sanitizing 

// const disallowed = doc.querySelector("script, foreignObject");
// if (disallowed) return false;


// import DOMPurify from 'dompurify';
// const safeSvg = DOMPurify.sanitize(decodeHtml(svg), { USE_PROFILES: { svg: true } });






export const Tabs = ({ position, accordion, slot }: TabsProps) => {
  // const rawId = useId(); // ensures uniqueness within React tree
  // const scopedId = useMemo(() => `css-${uuidv4()}`, [rawId]);
  const scopedId = useMemo(() => `tabs-${uuidv4()}`, []);

  return (

    <div id={scopedId}>
      {slot}
    </div>
  
)};

