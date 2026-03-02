import { Dropdown } from './Dropdown';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Dropdown, {
  name: 'Dropdown',
  description: 'Nestable navigation dropdown with configurable expansion direction and trigger mode.',
  group: 'Navigation',
  props: {
    // -------------------------------------------------------------------------
    // Content
    // -------------------------------------------------------------------------
    label: props.TextNode({
      name: 'Label',
      group: 'Content',
      defaultValue: 'Menu',
      tooltip: 'The trigger label text. Inline-editable on the Webflow canvas.',
    }),
    icon: props.Image({
      name: 'Icon',
      group: 'Content',
      tooltip: 'Optional leading icon displayed to the left of the label.',
    }),
    content: props.Slot({
      name: 'Content',
      group: 'Content',
      tooltip: 'Dropdown panel contents. Another Dropdown component can be placed here to create nested menus.',
    }),

    // -------------------------------------------------------------------------
    // Behavior
    // -------------------------------------------------------------------------
    position: props.Variant({
      name: 'Position',
      group: 'Behavior',
      options: ['below', 'above', 'right-down', 'right-up', 'left-down', 'left-up'],
      defaultValue: 'below',
      tooltip: 'Direction the panel expands relative to the trigger. Use right-*/left-* for side-expanding submenus.',
    }),
    openOnHover: props.Boolean({
      name: 'Open on Hover',
      group: 'Behavior',
      defaultValue: false,
      tooltip: 'When enabled, the panel opens on mouse hover instead of click. Each nested dropdown can have its own setting.',
    }),
    hoverCloseDelay: props.Number({
      name: 'Hover Close Delay (ms)',
      group: 'Behavior',
      defaultValue: 150,
      min: 0,
      max: 2000,
      tooltip: 'Milliseconds to wait before closing after the mouse leaves (hover mode only). Prevents accidental closes when moving to the panel.',
    }),

    // -------------------------------------------------------------------------
    // Transition
    // -------------------------------------------------------------------------
    fadeEnabled: props.Boolean({
      name: 'Fade Transition',
      group: 'Transition',
      defaultValue: true,
      tooltip: 'Fade the panel in and out when opening and closing.',
    }),
    fadeDuration: props.Number({
      name: 'Duration (ms)',
      group: 'Transition',
      defaultValue: 200,
      min: 0,
      max: 2000,
      tooltip: 'Duration of the fade transition in milliseconds.',
    }),
    fadeEasing: props.Text({
      name: 'Easing',
      group: 'Transition',
      defaultValue: 'ease',
      tooltip: 'CSS easing function for the fade transition. Examples: ease, ease-in-out, linear, cubic-bezier(0.4, 0, 0.2, 1)',
    }),

    // -------------------------------------------------------------------------
    // Advanced
    // -------------------------------------------------------------------------
    designMode: props.Boolean({
      name: 'Design Mode',
      group: 'Advanced',
      defaultValue: false,
      tooltip: 'Force the dropdown panel open for layout and styling in the Webflow Designer. Disable before publishing.',
    }),
  },
});
