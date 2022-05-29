import { createTheme } from '@material-ui/core/styles';

import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const theme = createTheme({
  palette,
  typography,
  overrides,
});

export default theme;
