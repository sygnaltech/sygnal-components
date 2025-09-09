import { FormFile } from './FormFile';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(FormFile, {
    name: 'Form File Upload',
    description: 'A file upload componenet for forms',
    group: 'Forms',
    props: {
        text: props.Text({
            name: "Message",
            defaultValue: "Drag & Drop Files Here",
        }),
        note: props.Text({
            name: "Note",
            defaultValue: "or, click to browse",
        }),
        variant: props.Variant({
            name: "Variant",
            options: ["Webflow", "Basin", "UploadCare"],
            defaultValue: "Webflow",
        }),
        fileTypes: props.Text({
            name: "File Types",
            defaultValue: "",
        }),
    },
});
