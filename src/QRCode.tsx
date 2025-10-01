import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

interface QRCodeProps {
  data: string;
  variant: '100x100' | '200x200' | '300x300' | '400x400' | '500x500' | '100%x100%';
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  includeMargin: boolean;
}

export const QRCode = ({
  data,
  variant,
  errorCorrection,
  foregroundColor,
  backgroundColor,
  includeMargin
}: QRCodeProps) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  // Parse dimensions from variant
  const isResponsive = variant === '100%x100%';
  const size = isResponsive ? 300 : parseInt(variant.split('x')[0]);

  useEffect(() => {
    if (!qrRef.current) return;

    // Create or update QR code
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: size,
        height: size,
        data: data || 'https://www.webflow.com',
        margin: includeMargin ? 10 : 0,
        qrOptions: {
          errorCorrectionLevel: errorCorrection,
        },
        dotsOptions: {
          color: foregroundColor,
          type: 'rounded',
        },
        backgroundOptions: {
          color: backgroundColor,
        },
      });
      qrCodeRef.current.append(qrRef.current);
    } else {
      qrCodeRef.current.update({
        data: data || 'https://www.webflow.com',
        width: size,
        height: size,
        margin: includeMargin ? 10 : 0,
        qrOptions: {
          errorCorrectionLevel: errorCorrection,
        },
        dotsOptions: {
          color: foregroundColor,
        },
        backgroundOptions: {
          color: backgroundColor,
        },
      });
    }
  }, [data, size, errorCorrection, foregroundColor, backgroundColor, includeMargin]);

  return (
    <div
      ref={qrRef}
      style={{
        width: isResponsive ? '100%' : `${size}px`,
        height: isResponsive ? '100%' : `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};
