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
            description: "URL or text to encode in the QR code",
        }),
        variant: props.Variant({
            name: "Size",
            options: ["100x100", "200x200", "300x300", "400x400", "500x500", "100%x100%"],
            defaultValue: "200x200",
        }),
        errorCorrection: props.Variant({
            name: "Error Correction",
            options: ["L", "M", "Q", "H"],
            defaultValue: "M",
            description: "L=7%, M=15%, Q=25%, H=30% error correction",
        }),
        foregroundColor: props.Color({
            name: "Foreground Color",
            defaultValue: "#000000",
        }),
        backgroundColor: props.Color({
            name: "Background Color",
            defaultValue: "#ffffff",
        }),
        includeMargin: props.Boolean({
            name: "Include Margin",
            defaultValue: true,
            description: "Add quiet zone around QR code",
        }),
    }
});
