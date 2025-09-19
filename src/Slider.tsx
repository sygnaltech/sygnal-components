import * as React from "react";
import { Swiper, SwiperSlide } from 'swiper/react'; 
import "swiper/css";
import "./Slider.css"; 

interface SliderProps {
  text: string;
  slot?: React.ReactNode; 
  variant: 'Light' | 'Dark';
}

export const Slider = ({ text, slot, variant }: SliderProps) => {
  console.log('=== SLOT DEBUG ===');
  console.log('slot:', slot);
  
  // Extract children from the slot
  let children: React.ReactNode[] = [];
  
  if (slot && typeof slot === 'object' && 'props' in slot) {
    // If slot is a Fragment or element with children, get its children
    children = React.Children.toArray(slot.props?.children || slot);
  } else {
    children = React.Children.toArray(slot);
  }
  
  console.log('extracted children:', children);
  console.log('children count:', children.length);
  
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {children.map((child, index) => (
        <SwiperSlide key={index}>
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );  
};