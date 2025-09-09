import { Tabs } from './Tabs';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Tabs, {
    name: 'Tab',
    description: 'A Tab implementsion.',
    group: 'Structure',
    props: {
        // position: props.Variant({
        //     name: "Position",
        //     options: ["Top Left", "Top Right", "Left", "Right", "Bottom Left", "Bottom Right"], 
        //     defaultValue: "Top Left",
        // }),
        // accordion: props.Variant({
        //     name: "Accordion Breakpoint",
        //     options: ["Desktop", "Tablet", "Mobile Landscape", "Mobile Portrait"], 
        //     defaultValue: "Mobile Landscape",
        // }),
        text: props.Text({
            name: "Tab Text",
        }),
        slot: props.Slot({
            name: "Content",
//            group?: string,
//            tooltip?: string
        }),
        name: props.Text({
            name: "Name",
            group: "Advanced",
        }),

        // Multiple variants? 
    }
});


