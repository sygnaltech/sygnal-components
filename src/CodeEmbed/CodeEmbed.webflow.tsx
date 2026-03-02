import { CodeEmbed } from './CodeEmbed';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(CodeEmbed, {
  name: 'Code Embed',
  group: 'Utility',
  options: {
    ssr: false,
  },
  props: {
    baseUrl: props.Text({
      name: 'Base URL',
      group: 'Content',
      defaultValue: '',
      tooltip: 'CDN base URL. The component loads {url}.html from this path.',
    }),

    // -------------------------------------------------------------------------
    // Embed Mode
    // -------------------------------------------------------------------------
    embedMode: props.Variant({
      name: 'Embed Mode',
      group: 'Embed Mode',
      options: ['iframe'],
      defaultValue: 'iframe',
      tooltip: 'How the content is embedded. iframe loads it in a fully isolated browsing context.',
    }),

    // -------------------------------------------------------------------------
    // Sizing
    // -------------------------------------------------------------------------
    sizingMode: props.Variant({
      name: 'Sizing',
      group: 'Sizing',
      options: ['explicit', 'auto'],
      defaultValue: 'explicit',
      tooltip: '"explicit" uses a fixed pixel height. "auto" grows to fit content via postMessage — a resize reporter is injected automatically.',
    }),
    height: props.Number({
      name: 'Height',
      group: 'Sizing',
      defaultValue: 400,
      min: 0,
      tooltip: 'iframe height in pixels (explicit mode only).',
    }),
    minHeight: props.Number({
      name: 'Min Height',
      group: 'Sizing',
      defaultValue: 100,
      min: 0,
      tooltip: 'Minimum iframe height in pixels (auto mode only). Applied while content is loading and as a floor.',
    }),
    width: props.Text({
      name: 'Width',
      group: 'Sizing',
      defaultValue: '100%',
      tooltip: 'iframe width as a CSS value, e.g. "100%" or "600px". Defaults to full container width.',
    }),
    scrolling: props.Variant({
      name: 'Scrolling',
      group: 'Sizing',
      options: ['auto', 'yes', 'no'],
      defaultValue: 'auto',
      tooltip: '"auto" shows scrollbars when content overflows. "yes" always shows them. "no" never shows them.',
    }),

    // -------------------------------------------------------------------------
    // Security
    // -------------------------------------------------------------------------
    sandbox: props.Boolean({
      name: 'Sandbox',
      group: 'Security',
      defaultValue: false,
      tooltip:
        'Applies iframe sandbox restrictions. Off by default. When enabled, allows scripts, forms, popups, and same-origin access while restricting other capabilities.',
    }),
    referrerPolicy: props.Boolean({
      name: 'Send Referrer',
      group: 'Security',
      defaultValue: true,
      tooltip:
        'When enabled (default), sends strict-origin-when-cross-origin referrer information with requests. Disable for maximum privacy.',
    }),

    // -------------------------------------------------------------------------
    // Permissions
    // -------------------------------------------------------------------------
    allowFullscreen: props.Boolean({
      name: 'Fullscreen',
      group: 'Permissions',
      defaultValue: true,
      tooltip: 'Allow the embedded content to enter fullscreen.',
    }),
    allowAutoplay: props.Boolean({
      name: 'Autoplay',
      group: 'Permissions',
      defaultValue: false,
      tooltip: 'Allow media to autoplay without user interaction.',
    }),
    allowCamera: props.Boolean({
      name: 'Camera',
      group: 'Permissions',
      defaultValue: false,
      tooltip: 'Allow the embedded content to access the device camera.',
    }),
    allowMicrophone: props.Boolean({
      name: 'Microphone',
      group: 'Permissions',
      defaultValue: false,
      tooltip: 'Allow the embedded content to access the device microphone.',
    }),
    allowGeolocation: props.Boolean({
      name: 'Geolocation',
      group: 'Permissions',
      defaultValue: false,
      tooltip: 'Allow the embedded content to access the device location.',
    }),
    allowClipboardWrite: props.Boolean({
      name: 'Clipboard Write',
      group: 'Permissions',
      defaultValue: false,
      tooltip: 'Allow the embedded content to write to the clipboard.',
    }),
    allowPayment: props.Boolean({
      name: 'Payment',
      group: 'Permissions',
      defaultValue: false,
      tooltip: 'Allow the Payment Request API within the embedded content.',
    }),
    allowDisplayCapture: props.Boolean({
      name: 'Display Capture',
      group: 'Permissions',
      defaultValue: false,
      tooltip: 'Allow the embedded content to capture the screen.',
    }),
  },
});
