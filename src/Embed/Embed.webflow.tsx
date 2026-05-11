import { Embed } from './Embed';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Embed, {
  name: 'Embed',
  group: 'Utility',
  props: {
    slot: props.Slot({
      name: 'Embed',
      tooltip:
        'Drop a Webflow Embed element inside. Write macros as {{wf name}} or {{wf {"path":"name"} }} — both look up "name" as a custom attribute on the embed element itself and substitute its value at hydration.',
    }),
  },
});
