// Any Global Types go here
declare module 'vue-material-design-icons/*.vue' {
  export const IconVue: import('vue').DefineComponent<{
    /// `size` defaults to 24
    size?: number;
    /// `fillColor` defaults to 'currentColor'
    fillColor?: string;
    title?: string;
  }>;
}
