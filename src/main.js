// @ts-check
import App from './App.svelte';

// Make sure we're in Eagle environment
if (typeof eagle !== 'undefined') {
    eagle.onPluginCreate(() => {
        const app = new App({
            target: document.body
        });

        return () => {
            app.$destroy();
        };
    });

    eagle.onThemeChanged(
        /** @type {(theme: string) => void} */
        (theme) => {
        document.body.setAttribute('theme', theme);
    });
} else {
    // For development environment
    new App({
        target: document.body
    });
}
