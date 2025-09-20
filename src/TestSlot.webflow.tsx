import { TestSlot } from './TestSlot';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(TestSlot, {
    name: 'TestSlot',
    description: 'A simple component that just renders a slot',
    props: {
        children1: props.Slot({
            name: "Content",
            group: "Content"
        }),
    },
});