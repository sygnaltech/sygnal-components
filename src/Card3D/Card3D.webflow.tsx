import { Card3D } from './Card3D';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Card3D, {
  name: '3D Card',
  description:
    'Card that tilts toward the mouse cursor. Descendants with a z-pos="N" custom attribute float N pixels above the card surface.',
  group: 'Effects',
  props: {
    // -------------------------------------------------------------------------
    // Content
    // -------------------------------------------------------------------------
    slot: props.Slot({
      name: 'Content',
      group: 'Content',
      tooltip:
        'Card contents. Add a z-pos="N" custom attribute to any descendant element (N in pixels) to make it float above the card surface during the tilt.',
    }),

    // -------------------------------------------------------------------------
    // Tilt
    // -------------------------------------------------------------------------
    tiltAmount: props.Number({
      name: 'Tilt Amount',
      group: 'Tilt',
      defaultValue: 8,
      min: 0,
      max: 30,
      tooltip:
        'Maximum tilt angle in degrees when the mouse is at a corner. 0 disables the tilt. Subtle values (4–10) feel most natural.',
    }),
    perspective: props.Number({
      name: 'Perspective',
      group: 'Tilt',
      defaultValue: 1000,
      min: 100,
      max: 3000,
      tooltip:
        'CSS perspective in pixels. Lower values exaggerate the 3D effect; higher values make it more subtle.',
    }),
    zScale: props.Number({
      name: 'Depth Multiplier',
      group: 'Tilt',
      defaultValue: 1,
      min: 0,
      max: 10,
      tooltip:
        'Multiplier applied to every z-pos attribute value. Use this to globally amplify or flatten all floating elements without editing each z-pos.',
    }),

    // -------------------------------------------------------------------------
    // Transition
    // -------------------------------------------------------------------------
    followDuration: props.Number({
      name: 'Follow Smoothing (ms)',
      group: 'Transition',
      defaultValue: 80,
      min: 0,
      max: 500,
      tooltip:
        'Smoothing duration as the card follows the mouse. 0 = instant; small values (60–120) feel buttery.',
    }),
    resetDuration: props.Number({
      name: 'Reset Duration (ms)',
      group: 'Transition',
      defaultValue: 400,
      min: 0,
      max: 2000,
      tooltip:
        'How long the card takes to settle back to flat after the mouse leaves.',
    }),
    resetEasing: props.Text({
      name: 'Reset Easing',
      group: 'Transition',
      defaultValue: 'ease-out',
      tooltip:
        'CSS easing function used for the reset transition. Examples: ease, ease-out, cubic-bezier(0.34, 1.56, 0.64, 1).',
    }),
  },
});
