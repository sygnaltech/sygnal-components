import * as React from "react";

interface RenderAdjacentProps {
  debug?: boolean;
}

export const RenderAdjacent = ({
  debug = false
}: RenderAdjacentProps) => {
  const uniqueId = React.useMemo(() => `render-adjacent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, []);

  React.useEffect(() => {
    // Create and inject script that runs in global scope
    const script = document.createElement('script');
    script.id = `render-adjacent-script-${uniqueId}`;

    script.textContent = `
      (function() {
        const uniqueId = '${uniqueId}';
        const debug = ${debug};

        if (debug) console.log('=== RENDER ADJACENT SCRIPT (SSR) ===');
        if (debug) console.log('Looking for component with ID inside shadow DOM:', uniqueId);

        let retryCount = 0;
        const maxRetries = 5;

        function findAndRender() {
          retryCount++;

          if (retryCount > maxRetries) {
            if (debug) console.log('Max retries reached, giving up');
            return;
          }

          // Find all code islands
          const codeIslands = document.querySelectorAll('code-island');
          if (debug) console.log('Found code islands:', codeIslands.length);

          if (codeIslands.length === 0) {
            if (debug) console.log('No code islands found, retrying... (' + retryCount + '/' + maxRetries + ')');
            setTimeout(findAndRender, 500);
            return;
          }

          let targetCodeIsland = null;

          // Look inside each code island's shadow DOM for our unique ID
          for (let i = 0; i < codeIslands.length; i++) {
            const island = codeIslands[i];
            if (debug) console.log('Checking code island', i, ':', island);

            // Try to access shadow root
            if (island.shadowRoot) {
              if (debug) console.log('Found shadow root for island', i);
              const marker = island.shadowRoot.querySelector('[data-component-id="' + uniqueId + '"]');
              if (marker) {
                if (debug) console.log('Found our component marker in shadow DOM!', marker);
                targetCodeIsland = island;
                break;
              }
            } else {
              if (debug) console.log('No shadow root for island', i);
              // Try regular DOM access as fallback
              const marker = island.querySelector('[data-component-id="' + uniqueId + '"]');
              if (marker) {
                if (debug) console.log('Found our component marker in regular DOM!', marker);
                targetCodeIsland = island;
                break;
              }
            }
          }

          if (!targetCodeIsland) {
            if (debug) console.log('Could not find code island with our component ID, retrying... (' + retryCount + '/' + maxRetries + ')');
            setTimeout(findAndRender, 500);
            return;
          }

          if (debug) console.log('Found MY specific code island:', targetCodeIsland);

          // Check if we already created a div for this island
          const existingDiv = document.getElementById('render-adjacent-' + uniqueId);
          if (existingDiv) {
            if (debug) console.log('Green div already exists');
            return;
          }

          // Create the green div
          const greenDiv = document.createElement('div');
          greenDiv.style.cssText = 'width: 100%; height: 400px; background: green; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 20px 0;';
          greenDiv.textContent = 'RENDER ADJACENT - ' + uniqueId;
          greenDiv.id = 'render-adjacent-' + uniqueId;

          // Insert the green div AFTER the specific code island
          targetCodeIsland.parentNode.insertBefore(greenDiv, targetCodeIsland.nextSibling);

          if (debug) console.log('Green div inserted after MY specific code island');
        }

        // Start looking
        findAndRender();
      })();
    `;

    // Inject script into global scope
    document.head.appendChild(script);
    if (debug) console.log('RenderAdjacent script injected for ID:', uniqueId);

    return () => {
      // Cleanup script
      const existingScript = document.getElementById(`render-adjacent-script-${uniqueId}`);
      if (existingScript) {
        existingScript.remove();
      }

      // Cleanup the created div
      const createdDiv = document.getElementById(`render-adjacent-${uniqueId}`);
      if (createdDiv) {
        createdDiv.remove();
      }
    };
  }, [uniqueId, debug]);

  return (
    <div style={{ padding: '10px', border: '1px solid blue', background: '#f0f0f0' }}>
      <div
        data-component-id={uniqueId}
        style={{ display: 'none' }}
      >
        SSR Marker: {uniqueId}
      </div>
      <div style={{ color: '#666', fontSize: '14px' }}>
        RenderAdjacent Component
        <br />
        ID: {uniqueId}
        <br />
        {debug && 'Debug mode enabled - check console'}
        <br />
        SSR marker with data-component-id inside shadow DOM
      </div>
    </div>
  );
};