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
  slot?: React.ReactNode; 
}

export const Slider = ({ 
  slidesPerView = 3, 
  spaceBetween = 50, 
  loop = false,
  autoplay = false,
  autoplayDelay = 3000,
  slot
}: SliderProps) => {
  // Extract children from the slot (handles fragments)
  let children: React.ReactNode[] = [];
  
  if (slot && typeof slot === 'object' && 'props' in slot) {
    children = React.Children.toArray(slot.props?.children || slot);
  } else {
    children = React.Children.toArray(slot);
  }

  const swiperModules = autoplay ? [Autoplay] : [];

  return (
    <div className="slider-container">
      <Swiper
        modules={swiperModules}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        loop={loop}
        autoplay={autoplay ? {
          delay: autoplayDelay,
          disableOnInteraction: false,
        } : false}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {children.map((child, index) => (
          <SwiperSlide key={index}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );  
};