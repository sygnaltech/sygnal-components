import * as React from "react";
import "./Slide.css"; 

interface SlideProps {
  text: string;
  variant: 'Light' | 'Dark';
}

export const Slide = ({ text, variant }: SlideProps) => {
  return (
    <div className={`slide-${variant.toLowerCase()}`}>
      {text}
    </div>
  );  
};