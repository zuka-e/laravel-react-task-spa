/**
 * @type {import ('next/jest').default}
 * @see https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
 */
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  // to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/**
 * @type {import('jest').Config}
 * @see https://jestjs.io/docs/configuration
 */
const customJestConfig = {
  collectCoverage: true,
  verbose: true,
  testEnvironment: 'jest-environment-jsdom',
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  roots: ['<rootDir>/src/'],
  modulePaths: ['<rootDir>/src/'], // cf. `tsconfig.json:baseUrl`
  transformIgnorePatterns: ['node_modules/(?!react-markdown)/'],
};

// createJestConfig is exported this way
// to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
