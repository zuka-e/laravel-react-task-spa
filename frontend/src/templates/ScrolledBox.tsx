import { makeStyles } from '@material-ui/core/styles';
import { Box, BoxProps } from '@material-ui/core';

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

const ScrolledBox = (props: BoxProps & ScrollProps) => {
  const { root } = useStyles(props);
  return <Box className={root} {...props} />;
};

export default ScrolledBox;
