import React, { useState, useMemo } from 'react';

export interface ColorSwatchProps {
  color?: string;
  colorName?: 'As Specified' | 'Hex Color';
  style?: 'Plain' | 'Informative';
  size?: '32 x 32' | '48 x 48' | '64 x 64' | '96 x 96' | '128 x 128' | '154 x 154';
}

const SIZE_CONFIG: Record<string, { width: number; height: number; showHex: boolean; showRgb: boolean }> = {
  '32 x 32': { width: 32, height: 32, showHex: false, showRgb: false },
  '48 x 48': { width: 48, height: 48, showHex: false, showRgb: false },
  '64 x 64': { width: 64, height: 64, showHex: true, showRgb: false },
  '96 x 96': { width: 96, height: 96, showHex: true, showRgb: true },
  '128 x 128': { width: 128, height: 128, showHex: true, showRgb: true },
  '154 x 154': { width: 154, height: 154, showHex: true, showRgb: true },
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '');
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastTextColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#ffffff';
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.179 ? '#000000' : '#ffffff';
}

/**
 * Converts any CSS color value to a 6-digit hex color.
 * Supports: named colors, 3-digit hex, 6-digit hex, 8-digit hex (with alpha),
 * rgb(), rgba(), hsl(), hsla()
 */
function colorToHex(color: string): string {
  // Create an off-screen element to compute the color
  if (typeof document === 'undefined') {
    // SSR fallback - return as-is if it looks like hex, otherwise default
    if (/^#([a-f\d]{3}|[a-f\d]{6})$/i.test(color)) {
      const hex = color.replace('#', '');
      if (hex.length === 3) {
        return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toLowerCase();
      }
      return color.toLowerCase();
    }
    return color;
  }

  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return color;

  ctx.fillStyle = color;
  const computed = ctx.fillStyle;

  // If it's already hex, normalize it
  if (computed.startsWith('#')) {
    const hex = computed.replace('#', '');
    if (hex.length === 3) {
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toLowerCase();
    }
    // Handle 8-digit hex (with alpha) - strip alpha
    if (hex.length === 8) {
      return `#${hex.slice(0, 6)}`.toLowerCase();
    }
    return computed.toLowerCase();
  }

  // Parse rgb/rgba format: rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toLowerCase();
  }

  return color;
}

export function ColorSwatch({
  color = '#3c3530',
  colorName = 'As Specified',
  style = 'Plain',
  size = '64 x 64',
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  // Normalize color to 6-digit hex if colorName is 'Hex Color'
  const normalizedColor = useMemo(() => {
    if (colorName === 'Hex Color') {
      return colorToHex(color);
    }
    return color;
  }, [color, colorName]);

  const config = SIZE_CONFIG[size];
  const { width, height } = config;
  const showHex = style === 'Informative' && config.showHex;
  const showRgb = style === 'Informative' && config.showRgb;

  const cornerRadius = Math.round(width * 0.08);
  const textColor = getContrastTextColor(normalizedColor);
  const rgb = hexToRgb(normalizedColor);
  const hexDisplay = normalizedColor.replace('#', '').toUpperCase();

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(normalizedColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  // Scale font sizes based on swatch size
  const hexFontSize = Math.round(width * 0.22);
  const rgbFontSize = Math.round(width * 0.11);
  const rgbBoxWidth = Math.round(width * 0.27);
  const rgbBoxHeight = Math.round(height * 0.19);
  const rgbBoxRadius = Math.round(rgbBoxHeight * 0.23);
  const rgbBoxY = height - rgbBoxHeight - Math.round(height * 0.05);
  const rgbBoxSpacing = (width - rgbBoxWidth * 3) / 4;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
      >
        {/* Background */}
        <rect
          width={width - 1}
          height={height - 1}
          x={0.5}
          y={0.5}
          fill={normalizedColor}
          rx={cornerRadius}
          ry={cornerRadius}
        />

        {/* Hex Code */}
        {showHex && (
          <text
            x={width / 2}
            y={showRgb ? height * 0.35 : height / 2 + hexFontSize * 0.35}
            fill={textColor}
            fontFamily="monospace"
            fontSize={hexFontSize}
            textAnchor="middle"
            letterSpacing="0"
          >
            {hexDisplay}
          </text>
        )}

        {/* RGB Values */}
        {showRgb && rgb && (
          <g>
            {/* R Box */}
            <rect
              width={rgbBoxWidth}
              height={rgbBoxHeight}
              x={rgbBoxSpacing}
              y={rgbBoxY}
              fill="#ffffff"
              rx={rgbBoxRadius}
              ry={rgbBoxRadius}
            />
            <text
              x={rgbBoxSpacing + rgbBoxWidth / 2}
              y={rgbBoxY + rgbBoxHeight * 0.7}
              fill="#000000"
              fontFamily="monospace"
              fontSize={rgbFontSize}
              textAnchor="middle"
            >
              {rgb.r}
            </text>

            {/* G Box */}
            <rect
              width={rgbBoxWidth}
              height={rgbBoxHeight}
              x={rgbBoxSpacing * 2 + rgbBoxWidth}
              y={rgbBoxY}
              fill="#ffffff"
              rx={rgbBoxRadius}
              ry={rgbBoxRadius}
            />
            <text
              x={rgbBoxSpacing * 2 + rgbBoxWidth * 1.5}
              y={rgbBoxY + rgbBoxHeight * 0.7}
              fill="#000000"
              fontFamily="monospace"
              fontSize={rgbFontSize}
              textAnchor="middle"
            >
              {rgb.g}
            </text>

            {/* B Box */}
            <rect
              width={rgbBoxWidth}
              height={rgbBoxHeight}
              x={rgbBoxSpacing * 3 + rgbBoxWidth * 2}
              y={rgbBoxY}
              fill="#ffffff"
              rx={rgbBoxRadius}
              ry={rgbBoxRadius}
            />
            <text
              x={rgbBoxSpacing * 3 + rgbBoxWidth * 2.5}
              y={rgbBoxY + rgbBoxHeight * 0.7}
              fill="#000000"
              fontFamily="monospace"
              fontSize={rgbFontSize}
              textAnchor="middle"
            >
              {rgb.b}
            </text>
          </g>
        )}
      </svg>

      {/* Copied Tooltip */}
      {copied && (
        <div
          style={{
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 12,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          Copied!
        </div>
      )}
    </div>
  );
}

export default ColorSwatch;
