declare module '*.svelte';

// TODO: Add types for Eagle API
interface Eagle {
    onPluginCreate(callback: () => () => void): void;
    onThemeChanged(callback: (theme: string) => void): void;
    app: {
        theme: string;
        [key: string]: unknown;
    };
    item: {
        getSelected(): Promise<any[]>;
    };
    [key: string]: unknown;
}

declare const eagle: Eagle;
