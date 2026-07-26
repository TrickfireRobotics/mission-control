// Ambient type declarations for vue-material-design-icons.
// A single wildcard covers every *.vue icon import from the package.
// This file is intentionally a .d.ts (not .ts) so it stays ambient even
// under "moduleDetection": "force" in tsconfig.json.
declare module 'vue-material-design-icons/*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{
        /** Icon size in px. Defaults to 24. */
        size?: number;
        /** Fill colour. Defaults to 'currentColor'. */
        fillColor?: string;
        title?: string;
    }>;
    export const icon: typeof component;
}
