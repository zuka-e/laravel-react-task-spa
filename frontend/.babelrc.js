const plugins = [
  [
    'babel-plugin-import',
    {
      libraryName: '@material-ui/core',
      // Use "'libraryDirectory': ''," if your bundler does not support ES modules
      libraryDirectory: 'esm',
      camel2DashComponentName: false,
    },
    'core',
  ],
  [
    'babel-plugin-import',
    {
      libraryName: '@material-ui/icons',
      // Use "'libraryDirectory': ''," if your bundler does not support ES modules
      libraryDirectory: 'esm',
      camel2DashComponentName: false,
    },
    'icons',
  ],
];

// https://nextjs.org/docs/advanced-features/customizing-babel-config
module.exports = {
  // Without `next/babel`, errors like `Unexpected token, expected ","` occur.
  presets: ['next/babel'],
  plugins,
};
