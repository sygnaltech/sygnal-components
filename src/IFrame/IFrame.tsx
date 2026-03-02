import React from 'react';

const SANDBOX_VALUE =
  'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals';

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

export interface IFrameProps {
  url?: string;
  // Sizing
  height?: number;
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

export function IFrame({
  url,
  height = 400,
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
}: IFrameProps) {
  if (!url) {
    return <div style={errorStyle}>No URL provided</div>;
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
      src={url}
      allow={allow}
      referrerPolicy={referrerPolicy ? 'strict-origin-when-cross-origin' : 'no-referrer'}
      sandbox={sandbox ? SANDBOX_VALUE : undefined}
      scrolling={scrolling}
      style={{
        border: 'none',
        display: 'block',
        width,
        height,
      }}
    />
  );
}
