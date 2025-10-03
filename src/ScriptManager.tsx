import React, { useEffect, useState } from 'react';

export interface ScriptManagerProps {
  devCodeUrl?: string;
  testCodeUrl?: string;
  prodCodeUrl?: string;
  async?: boolean;
  defer?: boolean;
}

// Cookie helper functions
const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const getCookie = (name: string): string | null => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const ScriptManager: React.FC<ScriptManagerProps> = ({
  devCodeUrl,
  testCodeUrl,
  prodCodeUrl,
  async = false,
  defer = false,
}) => {
  const [scriptMode, setScriptMode] = useState<'dev' | 'test' | 'prod' | null>(null);

  useEffect(() => {
    // Check URL parameters for ?dev, ?test, or ?prod
    const urlParams = new URLSearchParams(window.location.search);
    const devParam = urlParams.get('dev');
    const testParam = urlParams.get('test');
    const prodParam = urlParams.get('prod');

    if (devParam === 'false' || testParam === 'false' || prodParam === 'false') {
      // Delete cookie if any mode is set to false
      deleteCookie('script_mode');
      setScriptMode(null);
    } else if (devParam !== null) {
      // Set cookie to dev if ?dev exists
      setCookie('script_mode', 'dev');
      setScriptMode('dev');
    } else if (testParam !== null) {
      // Set cookie to test if ?test exists
      setCookie('script_mode', 'test');
      setScriptMode('test');
    } else if (prodParam !== null) {
      // Set cookie to prod if ?prod exists
      setCookie('script_mode', 'prod');
      setScriptMode('prod');
    } else {
      // Check if script_mode cookie exists
      const modeCookie = getCookie('script_mode');
      if (modeCookie === 'dev' || modeCookie === 'test' || modeCookie === 'prod') {
        setScriptMode(modeCookie);
      }
    }
  }, []);

  useEffect(() => {
    // Determine which URL to use based on mode
    let scriptUrl: string | undefined;

    if (scriptMode === 'dev') {
      scriptUrl = devCodeUrl;
    } else if (scriptMode === 'test') {
      scriptUrl = testCodeUrl;
    } else if (scriptMode === 'prod') {
      scriptUrl = prodCodeUrl;
    } else {
      // Default behavior when no cookie is set
      const hostname = window.location.hostname;
      const isWebflowPreview = hostname.includes('webflow.io');
      scriptUrl = isWebflowPreview ? testCodeUrl : prodCodeUrl;
    }

    // Only inject if we have a valid URL
    if (!scriptUrl) return;

    // Create script element
    const script = document.createElement('script');
    script.src = scriptUrl;

    if (async) {
      script.async = true;
    }

    if (defer) {
      script.defer = true;
    }

    // Append to document head
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [devCodeUrl, testCodeUrl, prodCodeUrl, async, defer, scriptMode]);

  // Handle closing the mode indicator
  const handleClose = () => {
    deleteCookie('script_mode');
    window.location.reload();
  };

  // Render mode indicator if a mode is active
  if (scriptMode) {
    const modeConfig = {
      dev: { label: 'Dev Mode', backgroundColor: '#dc2626' }, // red
      test: { label: 'Test Mode', backgroundColor: '#eab308' }, // yellow
      prod: { label: 'Prod Mode', backgroundColor: '#16a34a' }, // green
    };

    const config = modeConfig[scriptMode];

    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: config.backgroundColor,
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 9999,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer'
      }}
      onClick={handleClose}
      >
        <span>{config.label}</span>
        <span style={{
          fontSize: '16px',
          fontWeight: 'bold',
          opacity: 0.8
        }}>✕</span>
      </div>
    );
  }

  return null;
};
