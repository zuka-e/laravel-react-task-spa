import { createMuiTheme } from '@material-ui/core/styles';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#40cbb5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#e0fffa',
    },
  },
  typography,
});

export default theme;
