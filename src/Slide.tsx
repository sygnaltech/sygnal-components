import * as React from "react";
import { SwiperSlide } from 'swiper/react'; 
import "swiper/css";
import "./Slide.css"; 

interface SlideProps {
  text: string;
  variant: 'Light' | 'Dark';
}

export const Slide = ({ text, variant }: SlideProps) => {
  return (
      <SwiperSlide>{text}</SwiperSlide>
  );  
};
