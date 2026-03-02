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
            defaultValue: "#000000",
            tooltip: "Any CSS color value (hex, rgb, rgba, named color)",
            group: "Settings",
        }),
        style: props.Variant({
            name: "Style",
            options: ["Plain", "Informative"],
            defaultValue: "Plain",
            tooltip: "Plain shows color only. Informative shows hex/RGB data.",
            group: "Settings",
        }),
        size: props.Variant({
            name: "Size",
            options: ["32 x 32", "48 x 48", "64 x 64", "96 x 96", "128 x 128", "154 x 154"],
            defaultValue: "64 x 64",
            tooltip: "Preset size. Larger sizes show more information in Informative style.",
            group: "Settings",
        }),
        labelFormat: props.Variant({
            name: "Label Format",
            options: ["As Specified", "Hex Color"],
            defaultValue: "Hex Color",
            tooltip: "As Specified uses the color value as-is. Hex Color converts any color format to 6-digit hex.",
            group: "Label",
        }),
        labelColor: props.Variant({
            name: "Label Color",
            options: ["White", "Black", "Auto"],
            defaultValue: "Auto",
            tooltip: "Color of the label text. Auto uses white unless contrast is too low.",
            group: "Label",
        }),
    }
});
