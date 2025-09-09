import { Marquee } from './Marquee';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Marquee, {
    name: 'Marquee',
    group: 'Special',
    props: {
        variant: props.Variant({
            name: "Speed",
            tooltip: "Animation speed of the marquee",
            options: ["Slow", "Medium", "Fast"],
            defaultValue: "Medium",
        }),
        slot: props.Slot({ 
            name: "Content",
            tooltip: "Items to scroll in the marquee",
            group: "Content"
        }),
    }
});