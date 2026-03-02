import { Grid } from './Grid';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Grid, {
  name: 'Grid',
  description: 'Arrange the Content slot items in a CSS grid.',
  group: 'Layout',
  props: {
    columns: props.Number({
      name: 'Columns',
      group: 'Settings',
      min: 1,
      max: 100,
      defaultValue: 3,
      tooltip: 'Number of equal-width columns in the grid.',
    }),
    content: props.Slot({
      name: 'Content',
      group: 'Content',
      tooltip: 'Items to distribute across the grid.',
    }),
    debugMode: props.Boolean({
      name: 'Debug Mode',
      group: 'Advanced',
      defaultValue: false,
      tooltip: 'Show numbered badges for each item in the Content slot.',
    }),
  },
});
