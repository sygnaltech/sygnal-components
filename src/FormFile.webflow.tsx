import { FormFile } from './FormFile';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(FormFile, {
    name: 'Form File Upload',
    description: 'A drag & drop file upload component for forms with multiple service variants',
    group: 'Forms',
    props: {
        text: props.Text({
            name: "Message",
            tooltip: "Main drag & drop message",
            defaultValue: "Drag & Drop Files Here",
        }),
        note: props.Text({
            name: "Note",
            tooltip: "Secondary instruction text",
            defaultValue: "or, click to browse",
        }),
        variant: props.Variant({
            name: "Variant",
            tooltip: "Choose the form service variant",
            options: ["Webflow", "Basin", "UploadCare"],
            defaultValue: "Webflow",
        }),
        fileTypes: props.Text({
            name: "File Types",
            tooltip: "Accepted file types (e.g., 'images', 'pdf', '.jpg,.png' or MIME types). Leave empty for default image types",
            defaultValue: "",
        }),
    },
});