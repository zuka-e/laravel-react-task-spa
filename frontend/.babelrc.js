const plugins = [
  [
    'babel-plugin-import',
    {
      libraryName: '@material-ui/core',
      libraryDirectory: '', // if `esm`, `Unexpected token 'export'` occurs.
      camel2DashComponentName: false,
    },
    'core',
  ],
  [
    'babel-plugin-import',
    {
      libraryName: '@material-ui/icons',
      libraryDirectory: '',
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
