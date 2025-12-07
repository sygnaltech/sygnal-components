import React from "react";

interface VCardProps {
  variant: 'Button' | 'Slot';
  buttonText: string;
  buttonStyle?: string;
  filename: string;
  Slot?: React.ReactNode;
  fullName?: string;
  lastName?: string;
  firstName?: string;
  organization?: string;
  title?: string;
  cellPhone?: string;
  workPhone?: string;
  email?: string;
  additionalEmail?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  websiteUrl?: string;
  note?: string;
}

export const VCard = ({
  variant,
  buttonText,
  buttonStyle,
  filename,
  Slot,
  fullName,
  lastName,
  firstName,
  organization,
  title,
  cellPhone,
  workPhone,
  email,
  additionalEmail,
  streetAddress,
  city,
  state,
  postalCode,
  country,
  websiteUrl,
  note
}: VCardProps) => {

  const generateVCard = (): string => {
    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';

    // N field (Last;First;;;)
    if (lastName || firstName) {
      vcard += `N:${lastName || ''};${firstName || ''};;;\n`;
    }

    // FN field (Full Name)
    if (fullName) {
      vcard += `FN:${fullName}\n`;
    } else if (firstName || lastName) {
      vcard += `FN:${firstName || ''} ${lastName || ''}\n`.replace(/\s+/g, ' ').trim() + '\n';
    }

    // Organization
    if (organization) {
      vcard += `ORG:${organization}\n`;
    }

    // Title
    if (title) {
      vcard += `TITLE:${title}\n`;
    }

    // Cell Phone
    if (cellPhone) {
      vcard += `TEL;TYPE=CELL:${cellPhone}\n`;
    }

    // Work Phone
    if (workPhone) {
      vcard += `TEL;TYPE=WORK,VOICE:${workPhone}\n`;
    }

    // Email
    if (email) {
      vcard += `EMAIL;TYPE=WORK:${email}\n`;
    }

    // Additional Email
    if (additionalEmail) {
      vcard += `EMAIL:${additionalEmail}\n`;
    }

    // Address (ADR;TYPE=WORK:;;street;city;state;postal;country)
    if (streetAddress || city || state || postalCode || country) {
      vcard += `ADR;TYPE=WORK:;;${streetAddress || ''};${city || ''};`;
      vcard += `${state || ''};${postalCode || ''};${country || ''}\n`;
    }

    // Website URL
    if (websiteUrl) {
      vcard += `URL:${websiteUrl}\n`;
    }

    // Note
    if (note) {
      vcard += `NOTE:${note}\n`;
    }

    vcard += 'END:VCARD';

    return vcard;
  };

  const handleDownload = () => {
    const vcardData = generateVCard();

    // Ensure filename has .vcf extension
    let finalFilename = filename;
    if (!finalFilename.toLowerCase().endsWith('.vcf')) {
      finalFilename += '.vcf';
    }

    // Create blob and download
    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Render based on variant
  if (variant === 'Slot') {
    return (
      <div
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          handleDownload();
        }}
        style={{
          cursor: 'pointer',
          display: 'inline-block'
        }}
      >
        <div style={{ pointerEvents: 'none' }}>
          {Slot}
        </div>
      </div>
    );
  }

  // Button variant (default)
  // Parse custom CSS styles
  const parseInlineStyles = (styleString?: string): React.CSSProperties => {
    const defaultStyles: React.CSSProperties = {
      padding: '12px 24px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#0073e6',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      fontFamily: 'inherit',
    };

    if (!styleString) return defaultStyles;

    const customStyles: React.CSSProperties = {};
    styleString.split(';').forEach(rule => {
      const [property, value] = rule.split(':').map(s => s.trim());
      if (property && value) {
        // Convert kebab-case to camelCase
        const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        customStyles[camelProperty as any] = value;
      }
    });

    return { ...defaultStyles, ...customStyles };
  };

  return (
    <button
      onClick={handleDownload}
      style={parseInlineStyles(buttonStyle)}
    >
      {buttonText}
    </button>
  );
};
