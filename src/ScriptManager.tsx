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
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Check URL parameters for ?dev
    const urlParams = new URLSearchParams(window.location.search);
    const devParam = urlParams.get('dev');

    if (devParam === 'false') {
      // Delete cookie if ?dev=false
      deleteCookie('dev_mode');
      setIsDevMode(false);
    } else if (devParam !== null) {
      // Set cookie if ?dev exists (any value except false)
      setCookie('dev_mode', 'true');
      setIsDevMode(true);
    } else {
      // Check if dev_mode cookie exists
      const devCookie = getCookie('dev_mode');
      setIsDevMode(!!devCookie);
    }
  }, []);

  useEffect(() => {
    // Determine which URL to use based on mode
    let scriptUrl: string | undefined;

    if (isDevMode) {
      scriptUrl = devCodeUrl;
    } else {
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
  }, [devCodeUrl, testCodeUrl, prodCodeUrl, async, defer, isDevMode]);

  // Render dev mode indicator if in dev mode
  if (isDevMode) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#ff6b35',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 9999,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        Development Mode
      </div>
    );
  }

  return null;
};
