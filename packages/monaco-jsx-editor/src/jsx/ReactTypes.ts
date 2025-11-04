export const ReactTypes = `
// JSX Runtime module for new JSX transform
declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): React.ReactElement;
  export function jsxs(type: any, props: any, key?: any): React.ReactElement;
  export namespace jsx {
    export namespace JSX {
      export interface Element extends React.ReactElement<any, any> {}
      export interface IntrinsicElements {
        [elemName: string]: any;
      }
    }
  }
}

declare module 'react/jsx-dev-runtime' {
  export function jsxDEV(type: any, props: any, key?: any, isStaticChildren?: boolean, source?: any, self?: any): React.ReactElement;
  export namespace jsxDEV {
    export namespace JSX {
      export interface Element extends React.ReactElement<any, any> {}
      export interface IntrinsicElements {
        [elemName: string]: any;
      }
    }
  }
}

// Make React available globally
declare global {
  const React: {
    createElement: <P>(type: any, props?: P, ...children: any[]) => any;
    Fragment: any;
  };
  
}
`;
