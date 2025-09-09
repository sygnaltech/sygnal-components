import { Css } from './CssIsolation';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Css, {
    name: 'CSS Isolator',
    description: 'A CSS isolator. Use to override variables and styles on specific elements.',
    group: 'Style',
    props: {
        // variant: props.Variant({
        //     name: "Size",
        //     options: ["16x16", "24x24", "32x32", "48x48", "80x80", "104x104"], 
        //     defaultValue: "16x16",
        // }),
        cssVars: props.Text({
            name: "Variable Overrides",
            tooltip: "Specify variable overrides only <a href='foo'>test</a> [some](#)."
        }),
        css: props.Text({
            name: "CSS Overrides",
            tooltip: "Place CSS rules here, which can be inherited."
        }),
        slot: props.Slot({
            name: "Content",
//            group?: string,
            tooltip: "Nest components which should be affected by the isolated CSS rules."
        })

        // Multiple variants? 
    }
});


