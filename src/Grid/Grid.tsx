import React from 'react';

export interface GridProps {
  columns?: number;
  content?: React.ReactNode;
  debugMode?: boolean;
}

const clampColumns = (value?: number) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 1;
  }
  return Math.min(100, Math.max(1, Math.round(value)));
};

export const Grid: React.FC<GridProps> = ({
  columns = 3,
  content,
  debugMode = false,
}) => {
  const normalizedColumns = clampColumns(columns);

  // Create CSS that applies grid to the host and makes slot wrapper transparent
  const gridStyles = `
    :host {
      display: grid !important;
      grid-template-columns: repeat(${normalizedColumns}, minmax(0, 1fr)) !important;
      gap: 1rem !important;
      align-items: start !important;
      width: 100% !important;
    }
    ::slotted(*) {
      display: contents !important;
    }
  `;

  return (
    <>
      <style>{gridStyles}</style>
      {content}
      {debugMode && (
        <div
          style={{
            gridColumn: '1 / -1',
            marginTop: 8,
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            color: '#111827',
            fontSize: 13,
            lineHeight: 1.4,
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Grid Debug</div>
          <div>Columns: {normalizedColumns}</div>
        </div>
      )}
    </>
  );
};
