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
        columns: props.Number({
            name: "Columns",
            tooltip: "Number of columns in the masonry layout",
            defaultValue: 4,
            min: 1,
            max: 12,
        }),
        marginX: props.Number({
            name: "Margin X",
            tooltip: "Horizontal spacing between items (pixels)",
            defaultValue: 24,
            min: 0,
            max: 100,
        }),
        marginY: props.Number({
            name: "Margin Y",
            tooltip: "Vertical spacing between items (pixels)",
            defaultValue: 24,
            min: 0,
            max: 100,
        }),
        tabletColumns: props.Number({
            name: "Tablet Columns",
            tooltip: "Number of columns on tablet (1024px and below). Leave empty to use desktop columns.",
            min: 1,
            max: 12,
        }),
        mobileLandscapeColumns: props.Number({
            name: "Mobile Landscape Columns",
            tooltip: "Number of columns on mobile landscape (768px and below). Leave empty to use tablet columns.",
            min: 1,
            max: 12,
        }),
        mobilePortraitColumns: props.Number({
            name: "Mobile Portrait Columns",
            tooltip: "Number of columns on mobile portrait (480px and below). Leave empty to use mobile landscape columns.",
            min: 1,
            max: 12,
        }),
        debug: props.Boolean({
            name: "Debug",
            tooltip: "Enable console logging for debugging",
            defaultValue: false,
        }),
    }
});
