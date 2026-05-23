// Mock for import.meta in Jest environment
export const importMetaMock = {
  env: {
    VITE_API_BASE_URL: 'http://localhost:3001',
    DEV: false, // Set to false for tests (production-like behavior)
  },
};

// Inject into globalThis
if (typeof globalThis !== 'undefined') {
  Object.defineProperty(globalThis, 'import', {
    value: {
      meta: importMetaMock,
    },
    writable: true,
    configurable: true,
  });
}
