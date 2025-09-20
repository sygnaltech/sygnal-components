import { DesignMode } from './DesignMode';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(DesignMode, {
    name: 'DesignMode',
    description: 'A component that displays different content based on Webflow environment (Designer/Preview/Published)',
    group: 'Info',
    options: {
        ssr: false, // Disable server-side rendering since we need window object
    },
    props: {
        debug: props.Boolean({
            name: "Debug",
            tooltip: "Enable debug information overlay",
            defaultValue: false,
        }),
    },
});