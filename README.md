# Sygnal Components

A Webflow Code Components Library built with React and TypeScript, providing reusable UI components that integrate seamlessly with Webflow's visual editor.

## Overview

**Sygnal Components** is a specialized component library designed for Webflow designers and developers. It provides utility and styling components that extend Webflow's capabilities with dynamic features, isolated styling, and environment-aware script management.

**Version:** 0.1.2
**Built with:** React 19.1.1, TypeScript, Vite, @webflow/react

## Components

### SVG Icon

Renders inline SVG icons with validated, sanitized SVG code.

**Features:**
- Accepts raw SVG code as input with automatic validation
- HTML entity decoding for properly encoded SVG strings
- 6 predefined sizes: 16×16, 24×24, 32×32, 48×48, 80×80, 104×104
- Fallback to default icon if no SVG provided
- Security: Prevents invalid/malicious SVG code

**Use Cases:**
- Displaying custom icons from external sources
- Dynamic icon rendering based on CMS data
- Consistent icon sizing across your Webflow site

---

### CSS Isolator

Creates a scoped CSS container to apply isolated CSS rules and CSS variable overrides without affecting the rest of the page.

**Features:**
- Automatic CSS scoping via unique ID generation
- CSS selector prefixing to isolate styles
- Support for CSS variable overrides
- Slot support for nesting child components
- HTML entity decoding for properly encoded CSS

**Use Cases:**
- Applying component-specific styles without global pollution
- Overriding CSS variables for specific sections
- Creating self-contained styled modules
- Preventing style conflicts in complex Webflow projects

**Example:**
```css
/* CSS Variables */
--primary-color: #3b82f6;
--spacing: 2rem;

/* Scoped Rules */
.button { background: var(--primary-color); }
```

---

### QR Code

Generates customizable QR codes from URLs or text data.

**Features:**
- 6 size options: 100×100, 200×200, 300×300, 400×400, 500×500, or responsive (100%)
- Customizable foreground and background colors
- 4 error correction levels: L (7%), M (15%), Q (25%), H (30%)
- Optional margin/quiet zone around QR code
- Real-time updates when properties change
- Powered by `qr-code-styling` library

**Use Cases:**
- Event tickets with dynamic QR codes
- Product pages with QR links to details
- Contact information QR codes
- Payment/donation links
- App download links

**Default Values:**
- Data: https://www.webflow.com
- Size: 200×200
- Colors: Black on white
- Error Correction: M (15%)
- Margin: Included

---

### Script Manager

Dynamically injects external scripts with intelligent environment detection for Dev, Test, and Production modes.

**Features:**
- Environment-aware script injection (Dev/Test/Prod)
- Automatic environment detection (*.webflow.io = Test)
- Cookie-based persistent mode selection
- URL parameter override support (`?dev`, `?test`, `?prod`)
- Visual mode indicator badge with color coding:
  - Dev Mode: Red
  - Test Mode: Yellow
  - Prod Mode: Green
- Configurable async/defer loading
- Automatic cleanup on unmount

**Use Cases:**
- Loading different analytics scripts per environment
- Testing integrations before production deployment
- Conditional feature flags based on environment
- A/B testing with separate script versions
- Development debugging without affecting production

**Environment Logic:**
1. URL parameters (`?dev`, `?test`, `?prod`) - highest priority
2. Stored cookie if previously set
3. Auto-detect: `webflow.io` domain = Test, otherwise = Prod

**Example Setup:**
- Dev Code URL: `https://cdn.example.com/script-dev.js`
- Test Code URL: `https://cdn.example.com/script-test.js`
- Prod Code URL: `https://cdn.example.com/script.js`

---

