import React, { useEffect } from 'react';

export interface CodeInjectorProps {
  devCodeUrl?: { href: string };
  testCodeUrl?: { href: string };
  prodCodeUrl?: { href: string };
  async?: boolean;
  defer?: boolean;
}

export const CodeInjector: React.FC<CodeInjectorProps> = ({
  devCodeUrl,
  testCodeUrl,
  prodCodeUrl,
  async = false,
  defer = false,
}) => {
  useEffect(() => {
    // Determine which URL to use based on hostname
    const hostname = window.location.hostname;
    const isWebflowPreview = hostname.includes('webflow.io');

    const scriptUrl = isWebflowPreview ? testCodeUrl?.href : prodCodeUrl?.href;

    console.log("scriptUrl", scriptUrl); 

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
  }, [testCodeUrl, prodCodeUrl, async, defer]);

  // This component doesn't render anything visible
  return null;
};
