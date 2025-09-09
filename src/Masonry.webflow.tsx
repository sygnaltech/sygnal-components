import { Masonry } from './Masonry';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Masonry, {
    name: 'Masonry',
    description: 'Masonry layout',
    group: 'Layouts',
    props: { 
        slot: props.Slot({ 
            name: "Content",
        })
        // text: props.Text({
        //     name: "Text",
        //     defaultValue: "Hello World",
        // }),
        // variant: props.Variant({
        //     name: "Variant",
        //     options: ["Light", "Dark"],
        //     defaultValue: "Light",
        // }),
    }
});
