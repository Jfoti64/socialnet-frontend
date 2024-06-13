// tests/setup.js
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  // Optionally, you can throw an error to make it fail the test
  throw reason;
});

// Mock console.error to suppress error output in tests
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Restore console.error after all tests
afterAll(() => {
  console.error.mockRestore();
});
