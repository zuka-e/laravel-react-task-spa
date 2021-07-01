import { makeStyles } from '@material-ui/core/styles';
import { Grid, GridProps } from '@material-ui/core';

type ScrollProps = {
  hover?: boolean;
};

const useStyles = makeStyles({
  root: {
    overflow: (props: ScrollProps) => (props.hover ? 'hidden' : 'auto'),
    '&:hover': {
      overflow: (props: ScrollProps) => (props.hover ? 'auto' : undefined),
    },
    '&::-webkit-scrollbar': {
      width: (props: ScrollProps) => (props.hover ? '2px' : '8px'),
      height: (props: ScrollProps) => (props.hover ? '2px' : '8px'),
    },
    '&::-webkit-scrollbar-track': { backgroundColor: '#eee' },
    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc' },
  },
});

const ScrolledGridContainer = (props: GridProps & ScrollProps) => {
  const { root } = useStyles(props);
  return <Grid container wrap='nowrap' classes={{ root }} {...props} />;
};

export default ScrolledGridContainer;
