import { Overrides } from '@material-ui/core/styles/overrides';

const overrides: Overrides = {
  MuiCssBaseline: {
    // GlobalCSS
    '@global': {
      a: {
        color: '#1a73e8',
        textDecoration: 'none',
        '&:hover': {
          color: '#ffa133',
          textDecoration: 'underline',
        },
      },
    },
  },
  // Buttonテキストの大文字変換設定を解除
  MuiButton: { root: { textTransform: 'unset' } },
};

export default overrides;
