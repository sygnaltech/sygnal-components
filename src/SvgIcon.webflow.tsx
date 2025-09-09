import { Svg } from './SvgIcon';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Svg, {
    name: 'SVG Icon',
    description: 'An inline SVG icon',
    group: 'Media',
    props: {
        variant: props.Variant({
            name: "Size",
            options: ["16x16", "24x24", "32x32", "48x48", "80x80", "104x104"], 
            defaultValue: "16x16",
        }),
        svg: props.Text({
            name: "SVG Code",
        }),
        // Multiple variants? 
    }
});


