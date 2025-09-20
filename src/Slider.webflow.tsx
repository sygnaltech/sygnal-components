import { Slider } from './Slider';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(Slider, {
    name: 'Slider',
    description: 'A swiper slider component',
    group: 'Info',
    props: {
        slidesPerView: props.Number({
            name: "Slides Per View",
            tooltip: "Number of slides to display concurrently",
            defaultValue: 3,
            min: 1,
            max: 10,
        }),
        spaceBetween: props.Number({
            name: "Space Between",
            tooltip: "Space between slides in pixels",
            defaultValue: 50,
            min: 0,
            max: 200,
        }),
        loop: props.Boolean({
            name: "Loop",
            tooltip: "Enable continuous loop mode",
            defaultValue: false,
        }),
        autoplay: props.Boolean({
            name: "Autoplay",
            tooltip: "Enable autoplay",
            defaultValue: false,
        }),
        autoplayDelay: props.Number({
            name: "Autoplay Delay",
            tooltip: "Delay between transitions in ms",
            defaultValue: 3000,
            min: 1000,
            max: 10000,
        }),
        slot: props.Slot({ 
            name: "Slides",
            tooltip: "Place any content here - each child becomes a slide",
            group: "Content"
        }),
    },
});