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
  MuiButtonBase: {
    root: {
      '& *': { pointerEvents: 'none' }, // `event.target`として捕捉されるのを防ぐ
    },
  },
  MuiButton: { root: { textTransform: 'unset' } }, // Buttonテキストの大文字変換設定を解除
  MuiList: { dense: { paddingTop: '4px', paddingBottom: '4px' } },
  MuiListItemIcon: { root: { minWidth: undefined, paddingRight: '16px' } },
  MuiListItemText: {
    primary: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  MuiTypography: {
    gutterBottom: {
      '&:not(div)': { marginBottom: '1.2rem' },
    },
  },
};

export default overrides;
