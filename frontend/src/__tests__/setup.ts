import '@testing-library/jest-dom'

// Mock import.meta for Vite environment variables
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: 'http://localhost:3001',
      },
    },
  },
  writable: true,
})
