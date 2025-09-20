import React from "react";

interface SlotProps {
  children1?: React.ReactNode;
}

export const TestSlot = ({
  children1
}: SlotProps) => {

    return (
      <div>
        {children1}
      </div>
    );

};