import * as React from "react";
import "./Slider.css";

interface Slider2Props {
  slidesPerView?: number;
  spaceBetween?: number;
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  height?: string;
  debug?: boolean;
  slot?: React.ReactNode;
}

export const Slider2 = ({
  slidesPerView = 3,
  spaceBetween = 50,
  loop = false,
  autoplay = false,
  autoplayDelay = 3000,
  height = "auto",
  debug = false,
  slot
}: Slider2Props) => {
  if (debug) {
    console.log('=== SLIDER2 RENDER ===');
    console.log('Props received:');
    console.log('- slidesPerView:', slidesPerView);
    console.log('- spaceBetween:', spaceBetween);
    console.log('- loop:', loop);
    console.log('- autoplay:', autoplay);
    console.log('- autoplayDelay:', autoplayDelay);
    console.log('- height:', height);
    console.log('- debug:', debug);
    console.log('Slot:', slot);
  }

  const containerRef = React.useRef<HTMLDivElement>(null);
  const slotRef = React.useRef<HTMLElement>(null);
  const sliderId = React.useMemo(() => `slider2-${Date.now()}`, []);

  React.useEffect(() => {
    // Create and inject script that runs in global scope (outside code island)
    const script = document.createElement('script');
    script.id = `slider2-script-${sliderId}`;

    // Create the script content as a string that will execute in global scope
    script.textContent = `
      (function() {
        const sliderId = '${sliderId}';
        const debug = ${debug};
        const slidesPerView = ${slidesPerView};
        const spaceBetween = ${spaceBetween};
        const loop = ${loop};
        const autoplay = ${autoplay};
        const autoplayDelay = ${autoplayDelay};

        if (debug) console.log('=== SLIDER2 GLOBAL SCRIPT ===');
        if (debug) console.log('Script running in global scope for:', sliderId);

        // Load Swiper CSS and JS if not already loaded
        if (!document.querySelector('link[href*="swiper"]')) {
          if (debug) console.log('Loading Swiper CSS...');
          const swiperCSS = document.createElement('link');
          swiperCSS.rel = 'stylesheet';
          swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
          document.head.appendChild(swiperCSS);
        }

        function initializeSlider() {
          if (debug) console.log('Looking for MY specific code island with ID:', sliderId);

          // We need to find the code island that contains THIS specific slider instance
          // Use a data attribute or global variable to match the script to its component
          window['slider2_' + sliderId + '_ready'] = true;

          // Look for code islands containing Slider2 components
          const codeIslands = document.querySelectorAll('code-island[data-props*="Slider2"]');
          if (debug) console.log('Found Slider2 code islands:', codeIslands.length);

          let targetCodeIsland = null;

          // Check each code island to see if it has our debug flag and slider ID marker
          for (const island of codeIslands) {
            // Check if this island has the debug flag set to true (matching our instance)
            const dataProps = island.getAttribute('data-props');
            if (dataProps && dataProps.includes('"debug":true')) {
              // This might be our island - check if it has slot content
              const slotContent = island.querySelector('[slot="slot"]');
              if (slotContent && slotContent.children.length > 0) {
                targetCodeIsland = island;
                if (debug) console.log('Found MY code island with debug=true and content:', island);
                break;
              }
            }
          }

          if (!targetCodeIsland) {
            if (debug) console.log('My specific code island not found, retrying...');
            setTimeout(initializeSlider, 1000);
            return;
          }

          const slotContent = targetCodeIsland.querySelector('[slot="slot"]');
          if (debug) console.log('Processing MY slot content:', slotContent);
          processSliderContent(targetCodeIsland, slotContent);
        }

        function processSliderContent(codeIsland, slotContent) {
          if (debug) console.log('Processing slider content...');

          // Extract all slide elements from the slot content
          let slideElements = Array.from(slotContent.children);
          if (debug) console.log('Initial slide elements:', slideElements);

          // Unwrap Webflow collection wrappers
          function extractItems(element) {
            const items = [];
            Array.from(element.children).forEach(function(childEl) {
              if (childEl.classList.contains('w-dyn-list') ||
                  childEl.classList.contains('w-dyn-items') ||
                  childEl.classList.contains('w-dyn-item')) {
                items.push(...extractItems(childEl));
              } else {
                items.push(childEl);
              }
            });
            return items;
          }

          const unwrappedSlides = [];
          slideElements.forEach(function(child) {
            if (child.classList.contains('w-dyn-list') ||
                child.classList.contains('w-dyn-items') ||
                child.classList.contains('w-dyn-item')) {
              if (debug) console.log('Found Webflow collection wrapper:', child.className);
              unwrappedSlides.push(...extractItems(child));
            } else {
              unwrappedSlides.push(child);
            }
          });

          if (debug) console.log('Unwrapped slides:', unwrappedSlides);
          if (unwrappedSlides.length === 0) {
            if (debug) console.log('No slides found after unwrapping');
            return;
          }

          // Create slider container OUTSIDE the code island
          const sliderContainer = document.createElement('div');
          sliderContainer.className = 'slider2-external-container';
          sliderContainer.id = 'slider2-external-' + sliderId;
          sliderContainer.style.cssText = 'width: 100%; height: 400px; background: #f0f0f0; border: 2px solid red; margin: 20px 0; position: relative;';

          // Add a visible header so we can see it was created
          const header = document.createElement('div');
          header.style.cssText = 'background: red; color: white; padding: 10px; font-weight: bold;';
          header.textContent = 'SLIDER2 EXTERNAL CONTAINER - ' + unwrappedSlides.length + ' slides';
          sliderContainer.appendChild(header);

          // Create swiper structure
          const swiperContainer = document.createElement('div');
          swiperContainer.className = 'swiper';
          swiperContainer.style.cssText = 'height: calc(100% - 40px); background: white;';

          const swiperWrapper = document.createElement('div');
          swiperWrapper.className = 'swiper-wrapper';

          // Clone slide elements into swiper structure
          unwrappedSlides.forEach(function(slideEl, index) {
            if (debug) console.log('Creating slide ' + index + ':', slideEl);
            const swiperSlide = document.createElement('div');
            swiperSlide.className = 'swiper-slide';
            swiperSlide.style.cssText = 'background: lightblue; border: 1px solid blue; padding: 10px;';
            swiperSlide.appendChild(slideEl.cloneNode(true));
            swiperWrapper.appendChild(swiperSlide);
          });

          swiperContainer.appendChild(swiperWrapper);
          sliderContainer.appendChild(swiperContainer);

          // Insert the new slider AFTER the code island
          if (debug) console.log('Inserting slider after code island...');
          codeIsland.parentNode.insertBefore(sliderContainer, codeIsland.nextSibling);
          if (debug) console.log('Slider inserted, container:', sliderContainer);

          // Hide the original code island
          codeIsland.style.display = 'none';
          if (debug) console.log('Code island hidden');

          if (debug) console.log('External slider structure created, initializing Swiper...');

          // Initialize Swiper on the external structure
          const swiperInstance = new window.Swiper(swiperContainer, {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetween,
            loop: loop,
            autoplay: autoplay ? {
              delay: autoplayDelay,
              disableOnInteraction: false,
            } : false,
            observer: true,
            observeParents: true
          });

          if (debug) console.log('Swiper initialized successfully:', swiperInstance);
        }

        // Load Swiper if needed
        if (!window.Swiper) {
          if (debug) console.log('Loading Swiper JS...');
          const swiperJS = document.createElement('script');
          swiperJS.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
          swiperJS.onload = function() {
            if (debug) console.log('Swiper JS loaded, initializing...');
            initializeSlider();
          };
          swiperJS.onerror = function() {
            if (debug) console.error('Failed to load Swiper JS');
          };
          document.head.appendChild(swiperJS);
        } else {
          if (debug) console.log('Swiper already loaded, initializing...');
          initializeSlider();
        }
      })();
    `;

    // Inject script into global scope
    document.head.appendChild(script);
    if (debug) console.log('Script injected into global scope');

    return () => {
      // Cleanup
      const existingScript = document.getElementById(`slider2-script-${sliderId}`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [sliderId, slidesPerView, spaceBetween, loop, autoplay, autoplayDelay, debug]);

  if (slot && typeof slot === 'object' && 'type' in slot && slot.type === 'slot') {
    return (
      <div
        ref={containerRef}
        className="slider-container"
        style={{ height, position: 'relative' }}
      >
        {React.createElement('slot', {
          ref: slotRef,
          name: slot.props?.name
        })}
        {debug && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px',
            fontSize: '12px',
            zIndex: 1000
          }}>
            Slider2 ID: {sliderId}
          </div>
        )}
      </div>
    );
  }

  return <div className="slider-container">Unexpected slot type</div>;
};