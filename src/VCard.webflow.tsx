import { VCard } from './VCard';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(VCard, {
    name: 'VCard',
    description: 'Download contact information as a vCard file',
    group: 'Interactive',
    props: {
        variant: props.Variant({
            name: "Type",
            options: ["Button", "Slot"],
            defaultValue: "Button",
            tooltip: "Use built-in button or custom slot content",
        }),
        buttonText: props.Text({
            name: "Button Text",
            defaultValue: "Save to Contacts",
            tooltip: "Text displayed on the download button (Button variant only)",
        }),
        buttonStyle: props.Text({
            name: "Button Style",
            defaultValue: "",
            tooltip: "Custom CSS styles for the button (e.g., background-color: red; color: white;)",
        }),
        Slot: props.Slot({
            name: "Content",
            tooltip: "Custom content to trigger vCard download (Slot variant only)",
        }),
        filename: props.Text({
            name: "Filename",
            defaultValue: "contact.vcf",
            tooltip: "Download filename (.vcf will be added automatically if missing)",
        }),
        fullName: props.Text({
            name: "Full Name",
            defaultValue: "",
            tooltip: "Complete name of the contact",
            group: "Contact Info",
        }),
        firstName: props.Text({
            name: "First Name",
            defaultValue: "",
            tooltip: "Given name",
            group: "Contact Info",
        }),
        lastName: props.Text({
            name: "Last Name",
            defaultValue: "",
            tooltip: "Family name",
            group: "Contact Info",
        }),
        organization: props.Text({
            name: "Organization",
            defaultValue: "",
            tooltip: "Company or organization name",
            group: "Contact Info",
        }),
        title: props.Text({
            name: "Title",
            defaultValue: "",
            tooltip: "Job title or position",
            group: "Contact Info",
        }),
        cellPhone: props.Text({
            name: "Cell Phone",
            defaultValue: "",
            tooltip: "Mobile phone number",
            group: "Phone & Email",
        }),
        workPhone: props.Text({
            name: "Work Phone",
            defaultValue: "",
            tooltip: "Work phone number",
            group: "Phone & Email",
        }),
        email: props.Text({
            name: "Email",
            defaultValue: "",
            tooltip: "Primary email address",
            group: "Phone & Email",
        }),
        additionalEmail: props.Text({
            name: "Additional Email",
            defaultValue: "",
            tooltip: "Secondary email address",
            group: "Phone & Email",
        }),
        streetAddress: props.Text({
            name: "Street Address",
            defaultValue: "",
            tooltip: "Street address",
            group: "Address",
        }),
        city: props.Text({
            name: "City",
            defaultValue: "",
            tooltip: "City name",
            group: "Address",
        }),
        state: props.Text({
            name: "State/Region",
            defaultValue: "",
            tooltip: "State, province, or region",
            group: "Address",
        }),
        postalCode: props.Text({
            name: "Postal Code",
            defaultValue: "",
            tooltip: "ZIP or postal code",
            group: "Address",
        }),
        country: props.Text({
            name: "Country",
            defaultValue: "",
            tooltip: "Country name",
            group: "Address",
        }),
        websiteUrl: props.Text({
            name: "Website URL",
            defaultValue: "",
            tooltip: "Website or social media URL",
            group: "Additional",
        }),
        note: props.Text({
            name: "Note",
            defaultValue: "",
            tooltip: "Additional notes about the contact",
            group: "Additional",
        }),
    }
});
