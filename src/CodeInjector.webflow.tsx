import { CodeInjector } from './CodeInjector';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(CodeInjector, {
    name: 'Code Injector',
    description: 'Dynamically injects external scripts based on environment (Test vs Prod)',
    group: 'Utilities',
    props: {
        devCodeUrl: props.Link({
            name: "Dev Code URL",
            tooltip: "Script URL for development environment (not currently used)",
        }),
        testCodeUrl: props.Link({
            name: "Test Code URL",
            tooltip: "Script URL for Webflow preview/test environments (*.webflow.io)",
        }),
        prodCodeUrl: props.Link({
            name: "Prod Code URL",
            tooltip: "Script URL for production environment",
        }),
        async: props.Boolean({
            name: "Async",
            defaultValue: false,
            tooltip: "Load script asynchronously",
        }),
        defer: props.Boolean({
            name: "Defer",
            defaultValue: false,
            tooltip: "Defer script execution until page load",
        }),
    }
});
