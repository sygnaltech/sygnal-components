import { RenderAdjacent } from './RenderAdjacent';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(RenderAdjacent, {
    name: 'RenderAdjacent',
    description: 'Test component to render a green div adjacent to its code island',
    group: 'Info',
    options: {
        ssr: false, // Disable server-side rendering
    },
    props: {
        debug: props.Boolean({
            name: "Debug",
            tooltip: "Enable console logging for debugging",
            defaultValue: false,
        }),
    },
});