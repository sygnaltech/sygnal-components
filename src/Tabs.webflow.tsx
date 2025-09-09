import { Tabs } from './Tabs';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Tabs, {
    name: 'Tabs',
    description: 'A Tabs implementsion.',
    group: 'Structure',
    props: {
        position: props.Variant({
            name: "Position",
            options: ["Top Left", "Top Right", "Left", "Right", "Bottom Left", "Bottom Right"], 
            defaultValue: "Top Left",
        }),
        accordion: props.Variant({
            name: "Accordion Breakpoint",
            options: ["Desktop", "Tablet", "Mobile Landscape", "Mobile Portrait"], 
            defaultValue: "Mobile Landscape",
        }),
        slot: props.Slot({
            name: "Tabs",
//            group?: string,
//            tooltip?: string
        })

        // Multiple variants? 
    }
});


