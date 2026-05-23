// Helper to get API base URL - works in both Vite and Jest environments
export function getApiBaseUrl(): string {
  // In Jest tests, import.meta won't be available, so we return the default
  try {
    // import.meta.env is available in Vite but not in Jest
    return import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001';
  } catch {
    return 'http://localhost:3001';
  }
}
