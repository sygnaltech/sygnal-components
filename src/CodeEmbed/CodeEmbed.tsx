import React, { useState, useEffect, useRef } from 'react';

const SANDBOX_VALUE =
  'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals';

const AUTO_RESIZE_SCRIPT =
  `<script>(function(){function r(){window.parent.postMessage({type:'codeEmbedResize',height:document.documentElement.scrollHeight},'*');}new ResizeObserver(r).observe(document.documentElement);window.addEventListener('load',r);})();</script>`;

const errorStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5em',
  border: '2px dashed currentColor',
  borderRadius: '4px',
  opacity: 0.5,
  fontSize: '0.875em',
  fontFamily: 'inherit',
  color: 'inherit',
};

export interface CodeEmbedProps {
  baseUrl?: string;
  // Embed Mode
  embedMode?: 'iframe';
  // Sizing
  sizingMode?: 'explicit' | 'auto';
  height?: number;
  minHeight?: number;
  width?: string;
  scrolling?: 'auto' | 'yes' | 'no';
  // Security
  sandbox?: boolean;
  referrerPolicy?: boolean;
  // Permissions
  allowFullscreen?: boolean;
  allowAutoplay?: boolean;
  allowCamera?: boolean;
  allowMicrophone?: boolean;
  allowGeolocation?: boolean;
  allowClipboardWrite?: boolean;
  allowPayment?: boolean;
  allowDisplayCapture?: boolean;
}

export function CodeEmbed({
  baseUrl,
  sizingMode = 'explicit',
  height = 400,
  minHeight = 100,
  width = '100%',
  scrolling = 'auto',
  sandbox = false,
  referrerPolicy = true,
  allowFullscreen = true,
  allowAutoplay = false,
  allowCamera = false,
  allowMicrophone = false,
  allowGeolocation = false,
  allowClipboardWrite = false,
  allowPayment = false,
  allowDisplayCapture = false,
}: CodeEmbedProps) {
  const [srcdoc, setSrcdoc] = useState<string>('');
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [autoHeight, setAutoHeight] = useState<number>(minHeight);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch HTML and assemble full document
  useEffect(() => {
    if (!baseUrl) return;
    setFetchError(false);
    setSrcdoc('');
    setAutoHeight(minHeight);

    fetch(`${baseUrl}.html`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((html) => {
        const resizeScript = sizingMode === 'auto' ? AUTO_RESIZE_SCRIPT : '';
        setSrcdoc(
          `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${baseUrl}.css">${resizeScript}</head><body>${html}<script src="${baseUrl}.js"></script></body></html>`
        );
      })
      .catch(() => setFetchError(true));
  }, [baseUrl, sizingMode, minHeight]);

  // postMessage listener — only active in auto mode
  useEffect(() => {
    if (sizingMode !== 'auto') return;

    function handleMessage(event: MessageEvent) {
      if (
        event.source !== iframeRef.current?.contentWindow ||
        event.data?.type !== 'codeEmbedResize'
      ) return;
      setAutoHeight(Math.max(minHeight, event.data.height));
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sizingMode, minHeight]);

  if (!baseUrl || fetchError) {
    return <div style={errorStyle}>Unable to load live component</div>;
  }

  const allow = [
    allowFullscreen && 'fullscreen',
    allowAutoplay && 'autoplay',
    allowCamera && 'camera',
    allowMicrophone && 'microphone',
    allowGeolocation && 'geolocation',
    allowClipboardWrite && 'clipboard-write',
    allowPayment && 'payment',
    allowDisplayCapture && 'display-capture',
  ]
    .filter((x): x is string => Boolean(x))
    .join('; ');

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcdoc}
      allow={allow}
      referrerPolicy={referrerPolicy ? 'strict-origin-when-cross-origin' : 'no-referrer'}
      sandbox={sandbox ? SANDBOX_VALUE : undefined}
      scrolling={sizingMode === 'auto' ? 'no' : scrolling}
      style={{
        border: 'none',
        display: 'block',
        width,
        height: sizingMode === 'auto' ? autoHeight : height,
      }}
    />
  );
}
