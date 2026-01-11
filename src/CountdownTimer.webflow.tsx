import { CountdownTimer } from './CountdownTimer';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(CountdownTimer, {
  name: 'Countdown Timer',
  description: 'Personalized countdown timer based on first visit',
  group: 'Utilities',
  props: {
    duration: props.Text({
      name: 'Duration',
      group: 'Settings',
      defaultValue: '24h',
      tooltip: 'Countdown duration (e.g., "24h", "2d 12h", "1y 6M 5d 3h 30m 15s")',
    }),
    content: props.Slot({
      name: 'Content',
      group: 'Content',
      tooltip: 'Container with countdown-remaining attributes (days, hours, minutes, seconds, active, expired)',
    }),
    storageKey: props.Text({
      name: 'Storage Key',
      group: 'Settings',
      defaultValue: 'countdown',
      tooltip: 'LocalStorage key prefix for this timer (use different keys for independent timers)',
    }),
    leadingZeros: props.Boolean({
      name: 'Leading Zeros',
      group: 'Settings',
      defaultValue: true,
      tooltip: 'Pad single digits with zero (5 → "05")',
    }),
    debugMode: props.Boolean({
      name: 'Debug Mode',
      group: 'Advanced',
      defaultValue: false,
      tooltip: 'Show debug information panel',
    }),
  },
});
