import { withStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Box } from '@material-ui/core';

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

const ScrolledBox = withStyles({ root: scrollbar })(Box);

export default ScrolledBox;
