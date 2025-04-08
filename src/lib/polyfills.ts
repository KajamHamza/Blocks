
// Browser polyfill for Node.js global object
if (typeof window !== 'undefined' && !window.global) {
  (window as any).global = window;
}

export {};
