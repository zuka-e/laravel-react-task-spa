import { withStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Grid, GridProps } from '@material-ui/core';

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
  ...scrollbar,
  flexWrap: 'nowrap',
};

const ScrolledGridContainer = withStyles({ root })((props: GridProps) => (
  <Grid container {...props} />
));

export default ScrolledGridContainer;
