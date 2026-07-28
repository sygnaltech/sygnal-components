# Sygnal Components

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Webflow](https://img.shields.io/badge/Webflow-Code%20Components-146EF5?logo=webflow&logoColor=white)](https://developers.webflow.com/code-components)

A library of [Webflow Code Components](https://developers.webflow.com/code-components) built with React and TypeScript, providing reusable UI, layout, and utility components that install into Webflow's Designer and are configured entirely through its property panel.

## Overview

**Sygnal Components** extends Webflow with dynamic behaviour, isolated styling, and environment-aware tooling that would otherwise require hand-written custom code. Each component is authored as a standard React component and wrapped for Webflow via `@webflow/react`, exposing typed properties, slots, and variants directly in the Designer.

**Built with:** React, TypeScript, Vite, and `@webflow/react`.

## Components

| Component | Group | Description |
| --- | --- | --- |
| [3D Card](#3d-card) | Effects | Card that tilts toward the cursor, with descendants that float above the surface. |
| [Code Embed](#code-embed) | Utility | Loads an HTML document from a CDN base URL into an isolated iframe, with auto-sizing. |
| [Color Swatch](#color-swatch) | UI | Color swatch with click-to-copy and optional hex/RGB readout. |
| [Countdown Timer](#countdown-timer) | Utility | Per-visitor countdown anchored to the first visit, driven by custom attributes. |
| [Countup](#countup) | Interactive | Animates numeric text from a start value up to a target when triggered. |
| [CSS Isolator](#css-isolator) | Style | Scoped container for CSS overrides and variable changes without global bleed. |
| [Dropdown](#dropdown) | Navigation | Nestable dropdown menu with configurable expansion direction and trigger mode. |
| [Embed](#embed) | Utility | Wraps a Webflow Embed and substitutes `{{wf …}}` macros at hydration. |
| [Grid](#grid) | Layout | Arranges slotted items in a CSS grid. |
| [IFrame](#iframe) | Utility | Embeds a URL with configurable sizing, sandboxing, and feature permissions. |
| [QR Code](#qr-code) | Media | Generates a customizable QR code from text or URL data. |
| [Script Manager](#script-manager) | Utility | Injects external scripts based on the detected Dev / Test / Prod environment. |
| [SVG Icon](#svg-icon) | Media | Renders a validated, sanitized inline SVG icon. |
| [VCard](#vcard) | Interactive | Downloads contact information as a `.vcf` vCard file. |

---

### 3D Card

Card that tilts toward the mouse cursor for an interactive parallax effect. Any descendant carrying a `z-pos="N"` custom attribute floats N pixels above the card surface during the tilt.

- Configurable tilt amount, perspective, and a global depth multiplier for all floating layers
- Follow smoothing while tracking the cursor, plus a separate reset duration and easing when the mouse leaves
- Works with any slotted content

### Code Embed

Loads an external HTML document (`{url}.html`) from a CDN base URL into an isolated iframe.

- Explicit fixed-height sizing, or `auto` mode that grows to fit content via an injected `postMessage` resize reporter
- Configurable width, scrolling behaviour, and optional sandboxing
- Granular feature permissions: fullscreen, autoplay, camera, microphone, geolocation, clipboard, payment, and display capture

### Color Swatch

Displays a color swatch with click-to-copy functionality.

- Accepts any CSS color value (hex, rgb, rgba, named)
- **Plain** or **Informative** style (the latter surfaces hex/RGB data)
- Six preset sizes and configurable label format (as-specified or converted to hex)
- Auto-contrast label color that flips to stay legible

### Countdown Timer

A personalized countdown timer that anchors to each visitor's first visit and persists in `localStorage`.

- Flexible duration syntax (e.g. `24h`, `2d 12h`, `1y 6M 5d 3h 30m 15s`)
- Drives markup through `countdown-remaining` custom attributes (days, hours, minutes, seconds, active, expired)
- Independent timers via a configurable storage key, optional leading zeros, and a debug panel

### Countup

Animates numeric text within slotted content from a start value up to a target. Add a `template="value"` custom attribute to any element that should count.

- Triggers: `on-view` (with a visibility threshold), `on-load`, or `manual` via a `countup:start` event
- Configurable duration, easing, per-element stagger, and optional replay on re-entry
- Formatting for decimals, thousands separators, prefixes, and suffixes — all overridable per element via `data-*` attributes
- Respects the visitor's reduced-motion preference

### CSS Isolator

Creates a scoped container for applying isolated CSS rules and CSS variable overrides without affecting the rest of the page.

- Automatic scoping via a generated unique ID and selector prefixing
- Supports CSS variable overrides and nested child components through its slot
- Ideal for self-contained styled modules and preventing style conflicts

### Dropdown

A nestable navigation dropdown with configurable expansion direction and trigger mode.

- Expands below, above, or to either side (`right-down`, `left-up`, etc.) for side-expanding submenus
- Opens on click or hover, with a hover-close delay to prevent accidental closing
- Optional leading icon, inline-editable label, and a fade transition
- **Design Mode** forces the panel open for styling in the Designer

### Embed

Wraps a Webflow Embed element and substitutes macros at hydration time.

- Write macros as `{{wf name}}` or `{{wf {"path":"name"} }}` — both resolve `name` as a custom attribute on the embed element
- **Strict** mode (default) recognises only `{{wf …}}` macros; **Lenient** also accepts bare `{{name}}`

### Grid

Arranges the items in its Content slot into a CSS grid.

- Configurable number of equal-width columns
- Debug mode shows numbered badges for each slotted item

### IFrame

Embeds an external URL in an iframe with full control over sizing, security, and permissions.

- Configurable height, width, and scrolling
- Optional sandboxing and referrer policy
- Granular feature permissions: fullscreen, autoplay, camera, microphone, geolocation, clipboard, payment, and display capture

### QR Code

Generates a customizable QR code from URL or text data, powered by `qr-code-styling`.

- Multiple preset sizes plus a responsive (100%) option
- Customizable foreground and background colors
- Four error-correction levels (L, M, Q, H) and an optional quiet-zone margin
- Updates in real time as properties change

### Script Manager

Dynamically injects external scripts with environment detection for Dev, Test, and Production.

- Auto-detects environment (`*.webflow.io` = Test), with cookie persistence and `?dev` / `?test` / `?prod` URL overrides
- Separate script URLs per environment with configurable async/defer loading
- Color-coded mode indicator badge (Dev = red, Test = yellow, Prod = green)
- Cleans up on unmount

### SVG Icon

Renders an inline SVG icon from raw SVG code, with validation and sanitization.

- Accepts raw SVG input with automatic validation and HTML-entity decoding
- Preset sizes with a fallback default icon
- Guards against invalid or malicious SVG

### VCard

Lets visitors download contact information as a standard `.vcf` vCard file.

- **Button** variant with configurable text/style, or **Slot** variant to trigger from any custom content
- Full contact schema: name, organization, title, phones, emails, address, website, and notes
- Configurable download filename

## Architecture

Each component follows a dual-file pattern:

- `ComponentName.tsx` — the React implementation
- `ComponentName.webflow.tsx` — the Webflow wrapper that calls `declareComponent()` and declares typed props via `@webflow/data-types`

Webflow entry points are matched by the `./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)` pattern in `webflow.json`. Slots (`props.Slot()`) allow content to be inserted from within the Webflow Designer.

## Development

```bash
npm install        # install dependencies
npm run dev        # start the Vite dev server
npm run build      # production build
npm run preview    # preview the production build
npm test           # run tests
npm run deploy     # share the library to Webflow (webflow library share)
```

## License

[MIT](./LICENSE) © Sygnal
