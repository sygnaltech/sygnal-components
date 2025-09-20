import * as React from "react";
import { Swiper, SwiperSlide } from 'swiper/react'; 
import { Autoplay } from 'swiper/modules';
import "swiper/css";
import "./Slider.css"; 

interface SliderProps {
  slidesPerView?: number;
  spaceBetween?: number;
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  height?: string;
  slot?: React.ReactNode;
}

export const Slider = ({
  slidesPerView = 3,
  spaceBetween = 50,
  loop = false,
  autoplay = false,
  autoplayDelay = 3000,
  height = "auto",
  slot
}: SliderProps) => {
  console.log('=== SLIDER RENDER ===');
  console.log('Props received:');
  console.log('- slidesPerView:', slidesPerView);
  console.log('- spaceBetween:', spaceBetween);
  console.log('- loop:', loop);
  console.log('- autoplay:', autoplay);
  console.log('- autoplayDelay:', autoplayDelay);
  console.log('- height:', height);
  console.log('Slot:', slot);
  
  const slotRef = React.useRef<HTMLElement>(null);
  const swiperRef = React.useRef<any>(null);
  const [slideElements, setSlideElements] = React.useState<Element[]>([]);

  React.useEffect(() => {
    console.log('Effect running...');
    console.log('Slot ref:', slotRef.current);

    if (slotRef.current && 'assignedElements' in slotRef.current) {
      const elements = (slotRef.current as any).assignedElements();
      console.log('Assigned elements:', elements);

      if (elements.length > 0) {
        // Get the children of the first assigned element (the div wrapper)
        let children = Array.from(elements[0].children) as Element[];
        console.log('Initial children:', children);

        // Unwrap Webflow collection list wrappers
        const unwrappedChildren: Element[] = [];

        children.forEach((child) => {
          if (child.classList.contains('w-dyn-list') ||
              child.classList.contains('w-dyn-items') ||
              child.classList.contains('w-dyn-item')) {
            console.log('Found Webflow collection wrapper:', child.className);
            // Recursively unwrap nested collection elements
            const extractItems = (element: Element): Element[] => {
              const items: Element[] = [];
              (Array.from(element.children) as Element[]).forEach((childEl) => {
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
            unwrappedChildren.push(...extractItems(child));
          } else {
            unwrappedChildren.push(child);
          }
        });

        console.log('Unwrapped children:', unwrappedChildren);
        console.log('Number of unwrapped children:', unwrappedChildren.length);
        setSlideElements(unwrappedChildren);
      }
    }
  }, []);

  React.useEffect(() => {
    if (swiperRef.current && slideElements.length > 0) {
      console.log('Updating swiper with', slideElements.length, 'slides');
      swiperRef.current.update();
    }
  }, [slideElements]);

  const swiperModules = autoplay ? [Autoplay] : [];

  if (slot && typeof slot === 'object' && 'type' in slot && slot.type === 'slot') {
    console.log('Rendering with slot element');
    
    return (
      <div className="slider-container" style={{ height }}>
        <div style={{ display: 'none' }}>
          {React.createElement('slot', {
            ref: slotRef,
            name: slot.props?.name
          })}
        </div>
        <Swiper
          modules={swiperModules}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          loop={loop}
          autoplay={autoplay ? {
            delay: autoplayDelay,
            disableOnInteraction: false,
          } : false}
          onSwiper={(swiper) => {
            console.log('Swiper initialized');
            swiperRef.current = swiper;
          }}
          observer={true}
          observeParents={true}
        >
          {slideElements.map((element, index) => {
            console.log(`Creating slide ${index}:`, element);
            return (
              <SwiperSlide key={index}>
                <div dangerouslySetInnerHTML={{ __html: element.outerHTML }} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }

  console.log('Slot is not a slot element');
  return <div className="slider-container">Unexpected slot type</div>;
};