// Any Global Types go here
declare module 'vue-material-design-icons/*.vue' {
  import type { DefineComponent } from 'vue';

  export const IconVue: DefineComponent<{
    /// `size` defaults to 24
    size?: number;
    /// `fillColor` defaults to 'currentColor'
    fillColor?: string;
    title?: string;
  }>;
}
