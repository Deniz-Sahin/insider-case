import { createPinia, setActivePinia } from 'pinia'

/**
 * Setup function to be called before each test that uses Pinia stores
 */
export function setupPiniaForTest() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

/**
 * Mock fetch API
 */
export function mockFetch(data: any, ok = true) {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
    } as Response)
  ) as any
}
