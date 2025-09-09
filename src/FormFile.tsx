import * as React from "react";

interface FormFileProps {
  text: string;
  variant: 'Light' | 'Dark';
}

export const FormFile = ({ text, variant }: FormFileProps) => (
  <span>
    {text}
  </span>
);
