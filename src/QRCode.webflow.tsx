import { QRCode } from './QRCode';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(QRCode, {
    name: 'QR Code',
    description: 'Generate a QR code from text or URL data',
    group: 'Media',
    props: {
        data: props.Text({
            name: "Data",
            defaultValue: "https://www.webflow.com",
            tooltip: "URL or text to encode in the QR code",
        }),
        variant: props.Variant({
            name: "Size",
            options: ["100x100", "200x200", "300x300", "400x400", "500x500", "100%x100%"],
            defaultValue: "200x200",
        }),
        includeMargin: props.Boolean({
            name: "Margin",
            defaultValue: true,
            tooltip: "Add quiet zone around QR code",
            group: "Styling",
        }),
        foregroundColor: props.Text({
            name: "Foreground Color",
            defaultValue: "#000000",
            group: "Styling",
        }),
        backgroundColor: props.Text({
            name: "Background Color",
            defaultValue: "#ffffff",
            group: "Styling",
        }),
        errorCorrection: props.Variant({
            name: "Error Correction",
            options: ["L", "M", "Q", "H"],
            defaultValue: "M",
            tooltip: "L=7%, M=15%, Q=25%, H=30% error correction",
            group: "Advanced",
        }),
    }
});
