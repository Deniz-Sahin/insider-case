/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  testPathIgnorePatterns: ['/node_modules/', 'setup.ts', 'test-utils.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^uuid$': '<rootDir>/src/__tests__/__mocks__/uuid.ts',
  },
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'preserve',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        verbatimModuleSyntax: false,
        lib: ['es2017', 'dom'],
        types: ['jest', '@testing-library/jest-dom', 'vite/client'],
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*']
        }
      },
    }],
  },
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/**/__tests__/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  setupFiles: ['<rootDir>/src/__tests__/importMetaMock.ts'],
  globals: {
    'import.meta': {
      env: {
        VITE_API_BASE_URL: 'http://localhost:3001',
      },
    },
  },
}
