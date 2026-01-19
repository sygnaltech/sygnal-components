import { ColorSwatch } from './ColorSwatch';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(ColorSwatch, {
    name: 'Color Swatch',
    description: 'Display a color swatch with click-to-copy functionality',
    group: 'UI',
    props: {
        color: props.Text({
            name: "Color",
            defaultValue: "#3c3530",
            tooltip: "Hex color value (e.g., #3c3530)",
            group: "Settings",
        }),
        style: props.Variant({
            name: "Style",
            options: ["plain", "informative"],
            defaultValue: "plain",
            tooltip: "Plain shows color only. Informative shows hex/RGB data.",
            group: "Settings",
        }),
        size: props.Variant({
            name: "Size",
            options: ["xs", "sm", "md", "lg", "xl", "2xl"],
            defaultValue: "md",
            tooltip: "Preset size. Larger sizes show more information.",
            group: "Settings",
        }),
    }
});
