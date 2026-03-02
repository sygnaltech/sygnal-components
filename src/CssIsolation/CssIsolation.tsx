
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import React from "react";

interface CssIsolationProps {
  cssVars: string;
  css: string; 
//  variant: '16x16' | '24x24' | '32x32' | '48x48' | '80x80' | '104x104';
  slot?: React.ReactNode; 
}

// Sanitizing 

// const disallowed = doc.querySelector("script, foreignObject");
// if (disallowed) return false;


// import DOMPurify from 'dompurify';
// const safeSvg = DOMPurify.sanitize(decodeHtml(svg), { USE_PROFILES: { svg: true } });



function decodeHtml(input: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = input;
  return txt.value;
} 

function prefixCssSelectors(css: string, scopeId: string): string {
  const scoped = `#${scopeId}`;

  // Very simple regex-based prefixer (does not fully parse CSS grammar)
  return css.replace(/(^|\})\s*([^{@}][^{]*?)\s*\{/g, (_match, prefix, selector) => {
    const prefixedSelectors = selector
      .split(',')
      .map(s => `${scoped} ${s.trim()}`)
      .join(', ');
    return `${prefix} ${prefixedSelectors} {`;
  });
} 

export const Css = ({ cssVars, css, slot }: CssIsolationProps) => {
  // const rawId = useId(); // ensures uniqueness within React tree
  // const scopedId = useMemo(() => `css-${uuidv4()}`, [rawId]);
  const scopedId = useMemo(() => `css-${uuidv4()}`, []);

  const decodedVars = decodeHtml(cssVars);
  const decodedCss = decodeHtml(css);
  const scopedCss = prefixCssSelectors(decodedCss, scopedId);

  // Sanitize CSS code 
  // not needed as it's within a <style> block 
    
  return (

    <div id={scopedId}>
      <style
        dangerouslySetInnerHTML={{
          __html: `#${scopedId} { ${decodedVars} }`, 
        }}    
      />
      <style
        dangerouslySetInnerHTML={{
          __html: scopedCss, 
        }}    
      />
      {slot}
    </div>
  
)};
