
import React from "react";

interface SvgProps {
  svg: string;
  variant: '16x16' | '24x24' | '32x32' | '48x48' | '80x80' | '104x104';
}

// Sanitizing 
function isValidSvg(svg: string): boolean {
  const decoded = decodeHtml(svg);
  const parser = new DOMParser();
  const doc = parser.parseFromString(decoded, "image/svg+xml");

  // Check for <parsererror> or missing <svg>
  const hasError = doc.querySelector("parsererror");
  const isSvg = doc.documentElement.tagName.toLowerCase() === "svg";

  return !hasError && isSvg;
}


// const disallowed = doc.querySelector("script, foreignObject");
// if (disallowed) return false;


// import DOMPurify from 'dompurify';
// const safeSvg = DOMPurify.sanitize(decodeHtml(svg), { USE_PROFILES: { svg: true } });



function decodeHtml(input: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = input;
  return txt.value;
}

export const Svg = ({ svg, variant }: SvgProps) => {
  const [width, height] = variant.split('x').map(Number);  

  // Default SVG if none specified 
  if(!svg) {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"></path><path fill="currentColor" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8"></path></svg>`; 
  }
  
  // Sanitize SVG code 
  if (!isValidSvg(svg)) {
    throw new Error("Invalid SVG input");
  }

  return (

    <div
      style={{
          width,
          height,
      }}
      dangerouslySetInnerHTML={{
        __html: decodeHtml(svg),
      }}    
    />
  
)};
