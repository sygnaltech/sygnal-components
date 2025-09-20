import * as React from "react";

interface DesignModeProps {
  debug?: boolean;
}

type WebflowMode = 'designer' | 'preview' | 'published';

const detectWebflowMode = (): WebflowMode => {
  if (typeof window === 'undefined') return 'published';

  const htmlElement = document.documentElement;
  const bodyElement = document.body;

  // Designer mode: html element has wf-design-mode class
  if (htmlElement.classList.contains('wf-design-mode')) {
    return 'designer';
  }

  // Preview mode: body element has data-w-id attribute
  if (bodyElement && bodyElement.hasAttribute('data-w-id')) {
    return 'preview';
  }

  // Production mode: neither condition is met
  return 'published';
};

export const DesignMode = ({ debug = false }: DesignModeProps) => {
  const [mode, setMode] = React.useState<WebflowMode>('published');

  React.useEffect(() => {
    const detectedMode = detectWebflowMode();
    setMode(detectedMode);

    if (debug) {
      console.log('=== DESIGN MODE DETECTION ===');
      console.log('HTML classes:', document.documentElement.className);
      console.log('Has wf-design-mode:', document.documentElement.classList.contains('wf-design-mode'));
      console.log('Body data-w-id:', document.body?.getAttribute('data-w-id'));
      console.log('Detected mode:', detectedMode);
    }
  }, [debug]);

  const getModeConfig = (mode: WebflowMode) => {
    switch (mode) {
      case 'designer':
        return {
          backgroundColor: '#ff69b4', // Hot pink
          text: 'DESIGN MODE',
          textColor: '#ffffff'
        };
      case 'preview':
        return {
          backgroundColor: '#ffff00', // Yellow
          text: 'PREVIEW MODE',
          textColor: '#000000'
        };
      case 'published':
        return {
          backgroundColor: '#00ff00', // Green
          text: 'PRODUCTION MODE',
          textColor: '#000000'
        };
    }
  };

  const config = getModeConfig(mode);

  return (
    <div
      style={{
        width: '100%',
        height: '400px',
        backgroundColor: config.backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        fontWeight: 'bold',
        color: config.textColor,
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        border: '2px solid #000000',
        boxSizing: 'border-box'
      }}
    >
      {config.text}
      {debug && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            fontSize: '12px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px'
          }}
        >
          Mode: {mode} | wf-design-mode: {typeof window !== 'undefined' ? document.documentElement.classList.contains('wf-design-mode').toString() : 'SSR'} | data-w-id: {typeof window !== 'undefined' ? (document.body?.getAttribute('data-w-id') || 'none') : 'SSR'}
        </div>
      )}
    </div>
  );
};