import { Slide } from './Slide';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Slide, {
    name: 'Slide',
    description: 'A slider slide',
    group: 'Info',
    props: {
        text: props.Text({
            name: "Text",
            defaultValue: "Hello World",
        }),
        variant: props.Variant({
            name: "Variant",
            options: ["Light", "Dark"],
            defaultValue: "Light",
        }),
    },
});
