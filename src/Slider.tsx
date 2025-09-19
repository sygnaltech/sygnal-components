import * as React from "react";
import { Swiper, SwiperSlide } from 'swiper/react'; 
import "swiper/css";
import "./Slider.css"; 

interface SliderProps {
  text: string;
  variant: 'Light' | 'Dark';
}

export const Slider = ({ text, variant }: SliderProps) => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
      <SwiperSlide>Slide 4</SwiperSlide>
      ...
    </Swiper>
  );  
  // <span
  //   style={{
  //     backgroundColor: variant === 'Light' ? '#eee' : '#000',
  //     borderRadius: '1em',
  //     color: variant === 'Light' ? '#000' : '#fff',
  //     display: 'inline-block',
  //     fontSize: '14px',
  //     lineHeight: 2,
  //     padding: '0 1em',
  //   }}
  // >
  //   {text}
  // </span>
};
