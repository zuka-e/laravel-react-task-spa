import { withStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Typography } from '@material-ui/core';

const scrollbar: CSSProperties = {
  overflowX: 'hidden',
  overflowY: 'hidden',
  '&:hover': {
    overflowX: 'auto',
    overflowY: 'auto',
  },
  '&::-webkit-scrollbar': {
    width: '2px',
    height: '1px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#eee',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#ccc',
  },
};

const root: CSSProperties = {
  whiteSpace: 'nowrap',
  ...scrollbar,
};

const ScrolledTypography = withStyles({ root })(Typography);

export default ScrolledTypography;
