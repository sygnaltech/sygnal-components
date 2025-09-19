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
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {slot}
    </Swiper>
  );  
};
