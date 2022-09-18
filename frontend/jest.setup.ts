// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { server } from 'mocks/api/server';

import 'mocks/data';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' }); // Enable the mocking in tests.
});

afterEach(() => {
  server.resetHandlers(); // Reset any runtime handlers tests may use.
});

afterAll(() => {
  server.close(); // Clean up once the tests are done.
  jest.clearAllMocks();
});
