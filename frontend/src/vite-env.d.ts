/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_TINYMCE_API_KEY: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

// Add module declaration for classnames to ensure TypeScript recognizes it
declare module 'classnames' {
  const classNames: (...args: any[]) => string;
  export = classNames;
}

// Add module declaration for classnames/index.js as well
declare module 'classnames/index.js' {
  const classNames: (...args: any[]) => string;
  export = classNames;
  export default classNames;
}

// Add module declaration for react-is to provide backward compatibility
declare module 'react-is' {
  // Modern exports
  export function isElement(object: any): boolean;
  export function isValidElementType(type: any): boolean;
  export function isForwardRef(object: any): boolean;
  export function isMemo(object: any): boolean;
  export function isFragment(object: any): boolean;
  
  // Legacy exports (compatibility with older code)
  export const ForwardRef: symbol;
  export const Memo: symbol;
  export const Fragment: symbol;
  
  const ReactIs: {
    isElement: typeof isElement;
    isValidElementType: typeof isValidElementType;
    isForwardRef: typeof isForwardRef;
    isMemo: typeof isMemo;
    isFragment: typeof isFragment;
    ForwardRef: symbol;
    Memo: symbol;
    Fragment: symbol;
  };
  
  export default ReactIs;
} 