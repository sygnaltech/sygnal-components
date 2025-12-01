import React from "react";

interface VCardProps {
  variant: 'Button' | 'Slot';
  buttonText: string;
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
  postalCode?: string;
  country?: string;
  websiteUrl?: string;
  note?: string;
}

export const VCard = ({
  variant,
  buttonText,
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

    // Address (ADR;TYPE=WORK:;;street;city;;postal;country)
    if (streetAddress || city || postalCode || country) {
      vcard += `ADR;TYPE=WORK:;;${streetAddress || ''};${city || ''};`;
      vcard += `;${postalCode || ''};${country || ''}\n`;
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
  console.log('VCard render - variant:', variant, 'Slot exists:', !!Slot);

  if (variant === 'Slot') {
    return (
      <div
        onMouseDown={(e: React.MouseEvent) => {
          console.log('MouseDown captured');
          e.preventDefault();
          e.stopPropagation();
        }}
        onClickCapture={(e: React.MouseEvent) => {
          console.log('ClickCapture - target:', e.target, 'currentTarget:', e.currentTarget);
          e.preventDefault();
          e.stopPropagation();
          handleDownload();
          return false;
        }}
        onClick={(e: React.MouseEvent) => {
          console.log('Click - should not see this if capture worked');
          e.preventDefault();
          e.stopPropagation();
          handleDownload();
        }}
        style={{
          cursor: 'pointer',
          position: 'relative',
          border: '2px solid red' // DEBUG: visual indicator
        }}
      >
        <div style={{ pointerEvents: 'none' }}>
          {Slot}
        </div>
      </div>
    );
  }

  // Button variant (default)
  return (
    <button
      onClick={handleDownload}
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#0073e6',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        fontFamily: 'inherit',
      }}
    >
      {buttonText}
    </button>
  );
};
