import { Masonry } from './Masonry';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Masonry, {
    name: 'Masonry',
    description: 'Masonry layout for arranging content in a responsive grid',
    group: 'Layouts',
    options: {
        ssr: false, // Disable SSR to prevent hydration mismatch from UUID generation
    },
    props: {
        slot: props.Slot({
            name: "Content",
            tooltip: "Place any content here - items will be arranged in masonry layout",
            group: "Content"
        }),
        debug: props.Boolean({
            name: "Debug",
            tooltip: "Enable console logging for debugging",
            defaultValue: false,
        }),
    }
});
