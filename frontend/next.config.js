// > Avoid using new JavaScript features not available in your target Node.js version. next.config.js will not be parsed by Webpack, Babel or TypeScript.
// https://nextjs.org/docs/api-reference/next.config.js/introduction

/**
 * Solution to the following error.
 * ```text
 * error - ./node_modules/@uiw/react-markdown-preview/esm/styles/markdown.css
 * Global CSS cannot be imported from within node_modules.
 * Read more: https://nextjs.org/docs/messages/css-npm
 * Location: node_modules/@uiw/react-markdown-preview/esm/index.js
 * ```
 * @see https://github.com/uiwjs/react-md-editor/issues/52
 * @see https://github.com/uiwjs/next-remove-imports
 */
const removeImports = require('next-remove-imports')();

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: true,
};

module.exports = { ...removeImports(), ...nextConfig };
