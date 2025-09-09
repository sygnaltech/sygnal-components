
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import React from "react";

interface TabProps {
  // position: "Top Left" | "Top Right" | "Left" | "Right" | "Bottom Left" | "Bottom Right"; 
  // accordion: "Desktop" | "Tablet" | "Mobile Landscape" | "Mobile Portrait";  
  name: string; 
  text: string; 
  slot?: React.ReactNode; 
}

// Sanitizing 

// const disallowed = doc.querySelector("script, foreignObject");
// if (disallowed) return false;


// import DOMPurify from 'dompurify';
// const safeSvg = DOMPurify.sanitize(decodeHtml(svg), { USE_PROFILES: { svg: true } });






export const Tabs = ({ name, text, slot }: TabProps) => {
  // const rawId = useId(); // ensures uniqueness within React tree
  // const scopedId = useMemo(() => `css-${uuidv4()}`, [rawId]);
  const scopedId = useMemo(() => `tabs-${uuidv4()}`, []);

  return (

    <div>
      <div wfu-tab={name}>{text}</div>
      <div>
        {slot}
      </div>
    </div>
  
)};

