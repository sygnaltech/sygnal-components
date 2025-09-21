import * as React from "react";
import "./Slider.css";

interface Slider2Props {
  slidesPerView?: number;
  spaceBetween?: number;
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  height?: string;
  pagination?: boolean;
  navigation?: boolean;
  scrollbar?: boolean;
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
  pagination = false,
  navigation = false,
  scrollbar = false,
  debug = false,
  slot
}: Slider2Props) => {
  const uniqueId = React.useMemo(() => `slider2-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, []);

  if (debug) {
    console.log('=== SLIDER2 RENDER ===');
    console.log('Unique ID:', uniqueId);
    console.log('Props received:');
    console.log('- slidesPerView:', slidesPerView);
    console.log('- spaceBetween:', spaceBetween);
    console.log('- loop:', loop);
    console.log('- autoplay:', autoplay);
    console.log('- autoplayDelay:', autoplayDelay);
    console.log('- height:', height);
    console.log('- pagination:', pagination);
    console.log('- navigation:', navigation);
    console.log('- scrollbar:', scrollbar);
    console.log('- debug:', debug);
    console.log('Slot:', slot);
  }

  React.useEffect(() => {
    // Create and inject script that runs in global scope
    const script = document.createElement('script');
    script.id = `slider2-script-${uniqueId}`;

    script.textContent = `
      (function() {
        const uniqueId = '${uniqueId}';
        const debug = ${debug};
        const slidesPerView = ${slidesPerView};
        const spaceBetween = ${spaceBetween};
        const loop = ${loop};
        const autoplay = ${autoplay};
        const autoplayDelay = ${autoplayDelay};
        const height = '${height}';
        const pagination = ${pagination};
        const navigation = ${navigation};
        const scrollbar = ${scrollbar};

        if (debug) console.log('=== SLIDER2 SCRIPT (SSR) ===');

        // Load Swiper CSS and JS if not already loaded
        if (!document.querySelector('link[href*="swiper"]')) {
          if (debug) console.log('Loading Swiper CSS...');
          const swiperCSS = document.createElement('link');
          swiperCSS.rel = 'stylesheet';
          swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
          document.head.appendChild(swiperCSS);
        }

        let retryCount = 0;
        const maxRetries = 5;

        function findAndCreateSlider() {
          retryCount++;

          if (retryCount > maxRetries) {
            if (debug) console.log('Max retries reached, giving up');
            return;
          }

          // Find all code islands
          const codeIslands = document.querySelectorAll('code-island');

          if (codeIslands.length === 0) {
            setTimeout(findAndCreateSlider, 500);
            return;
          }

          let targetCodeIsland = null;

          // Look inside each code island's shadow DOM for our unique ID
          for (let i = 0; i < codeIslands.length; i++) {
            const island = codeIslands[i];

            // Try to access shadow root
            if (island.shadowRoot) {
              const marker = island.shadowRoot.querySelector('[data-component-id="' + uniqueId + '"]');
              if (marker) {
                if (debug) console.log('Found our component marker in shadow DOM!', marker);
                targetCodeIsland = island;
                break;
              }
            } else {
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
            setTimeout(findAndCreateSlider, 500);
            return;
          }

          if (debug) console.log('Found MY specific code island:', targetCodeIsland);

          // Get slot content - it's an immediate child of the code island itself, outside shadow root
          const slotContent = targetCodeIsland.querySelector('[slot="slot"]');

          if (!slotContent) {
            if (debug) console.log('No slot content found, retrying...');
            setTimeout(findAndCreateSlider, 500);
            return;
          }

          if (debug) console.log('Found slot content:', slotContent);
          if (debug) console.log('Slot content children:', slotContent.children);

          if (debug) console.log('Processing MY slot content:', slotContent);
          processSliderContent(targetCodeIsland, slotContent);
        }

        function processSliderContent(codeIsland, slotContent) {
          if (debug) console.log('Processing slider content...');
          if (debug) console.log('Slot content element:', slotContent);
          if (debug) console.log('Slot content children:', Array.from(slotContent.children));

          // Get the immediate children of the slot content
          let children = Array.from(slotContent.children);
          if (debug) console.log('Initial children:', children);

          // Unwrap Webflow collection list wrappers
          const unwrappedSlides = [];

          children.forEach(function(child) {
            if (child.classList.contains('w-dyn-list') ||
                child.classList.contains('w-dyn-items') ||
                child.classList.contains('w-dyn-item')) {
              if (debug) console.log('Found Webflow collection wrapper:', child.className);
              // Recursively unwrap nested collection elements
              const extractItems = function(element) {
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
              };
              unwrappedSlides.push(...extractItems(child));
            } else {
              unwrappedSlides.push(child);
            }
          });

          if (debug) console.log('Unwrapped slides:', unwrappedSlides);
          if (debug) console.log('Number of unwrapped slides:', unwrappedSlides.length);

          if (unwrappedSlides.length === 0) {
            if (debug) console.log('No slides found after unwrapping');
            return;
          }

          // Check if we already created a slider for this component
          const existingSlider = document.getElementById('slider2-external-' + uniqueId);
          if (existingSlider) {
            if (debug) console.log('Slider already exists for this component');
            return;
          }

          // Create slider container OUTSIDE the code island
          const sliderContainer = document.createElement('div');
          sliderContainer.className = 'slider2-external-container';
          sliderContainer.id = 'slider2-external-' + uniqueId;
          sliderContainer.style.cssText = 'width: 100%; height: ' + height + '; position: relative;';

          // Create swiper structure
          const swiperContainer = document.createElement('div');
          swiperContainer.className = 'swiper';
          swiperContainer.style.cssText = 'width: 100%; height: 100%;';

          const swiperWrapper = document.createElement('div');
          swiperWrapper.className = 'swiper-wrapper';

          // Clone slide elements into swiper structure
          unwrappedSlides.forEach(function(slideEl, index) {
            if (debug) console.log('Creating slide ' + index + ':', slideEl);
            const swiperSlide = document.createElement('div');
            swiperSlide.className = 'swiper-slide';
            swiperSlide.appendChild(slideEl.cloneNode(true));
            swiperWrapper.appendChild(swiperSlide);
          });

          swiperContainer.appendChild(swiperWrapper);

          // Add pagination if enabled
          let paginationElement = null;
          if (pagination) {
            paginationElement = document.createElement('div');
            paginationElement.className = 'swiper-pagination';
            swiperContainer.appendChild(paginationElement);
          }

          // Add navigation if enabled
          let prevElement = null;
          let nextElement = null;
          if (navigation) {
            prevElement = document.createElement('div');
            prevElement.className = 'swiper-button-prev';
            swiperContainer.appendChild(prevElement);

            nextElement = document.createElement('div');
            nextElement.className = 'swiper-button-next';
            swiperContainer.appendChild(nextElement);
          }

          // Add scrollbar if enabled
          let scrollbarElement = null;
          if (scrollbar) {
            scrollbarElement = document.createElement('div');
            scrollbarElement.className = 'swiper-scrollbar';
            swiperContainer.appendChild(scrollbarElement);
          }

          sliderContainer.appendChild(swiperContainer);

          // Insert the new slider AFTER the code island
          if (debug) console.log('Inserting slider after code island...');
          codeIsland.parentNode.insertBefore(sliderContainer, codeIsland.nextSibling);
          if (debug) console.log('Slider inserted, container:', sliderContainer);

          // Hide the original code island
          codeIsland.style.display = 'none';
          if (debug) console.log('Code island hidden');

          if (debug) console.log('External slider structure created, initializing Swiper...');

          // Build Swiper configuration
          const swiperConfig = {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetween,
            loop: loop,
            autoplay: autoplay ? {
              delay: autoplayDelay,
              disableOnInteraction: false,
            } : false,
            observer: true,
            observeParents: true
          };

          // Add pagination configuration
          if (pagination && paginationElement) {
            swiperConfig.pagination = {
              el: paginationElement,
              clickable: true,
              dynamicBullets: true
            };
          }

          // Add navigation configuration
          if (navigation && prevElement && nextElement) {
            swiperConfig.navigation = {
              nextEl: nextElement,
              prevEl: prevElement
            };
          }

          // Add scrollbar configuration
          if (scrollbar && scrollbarElement) {
            swiperConfig.scrollbar = {
              el: scrollbarElement,
              draggable: true
            };
          }

          // Initialize Swiper on the external structure
          const swiperInstance = new window.Swiper(swiperContainer, swiperConfig);

          if (debug) console.log('Swiper initialized successfully:', swiperInstance);
        }

        // Load Swiper if needed
        if (!window.Swiper) {
          if (debug) console.log('Loading Swiper JS...');
          const swiperJS = document.createElement('script');
          swiperJS.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
          swiperJS.onload = function() {
            if (debug) console.log('Swiper JS loaded, starting slider creation...');
            findAndCreateSlider();
          };
          swiperJS.onerror = function() {
            if (debug) console.error('Failed to load Swiper JS');
          };
          document.head.appendChild(swiperJS);
        } else {
          if (debug) console.log('Swiper already loaded, starting slider creation...');
          findAndCreateSlider();
        }
      })();
    `;

    // Inject script into global scope
    document.head.appendChild(script);
    if (debug) console.log('Slider2 script injected for ID:', uniqueId);

    return () => {
      // Cleanup script
      const existingScript = document.getElementById(`slider2-script-${uniqueId}`);
      if (existingScript) {
        existingScript.remove();
      }

      // Cleanup the created slider
      const createdSlider = document.getElementById(`slider2-external-${uniqueId}`);
      if (createdSlider) {
        createdSlider.remove();
      }
    };
  }, [uniqueId, slidesPerView, spaceBetween, loop, autoplay, autoplayDelay, height, pagination, navigation, scrollbar, debug]);

  if (slot && typeof slot === 'object' && 'type' in slot && slot.type === 'slot') {
    return (
      <div className="slider-container" style={{ height, position: 'relative' }}>
        <div
          data-component-id={uniqueId}
          style={{ display: 'none' }}
        >
          SSR Marker: {uniqueId}
        </div>
        {React.createElement('slot', {
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
            Slider2 ID: {uniqueId}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="slider-container">
      <div
        data-component-id={uniqueId}
        style={{ display: 'none' }}
      >
        SSR Marker: {uniqueId}
      </div>
      Unexpected slot type
    </div>
  );
};