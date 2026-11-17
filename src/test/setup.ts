import '@testing-library/jest-dom/vitest';

// jsdom не реалізує matchMedia (його використовує хук теми)
window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
})) as never;

// Headless UI та Tiptap очікують ResizeObserver
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as never;
