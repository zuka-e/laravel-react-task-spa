import { makeStyles } from '@material-ui/core/styles';
import { Typography, TypographyProps } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    '&:hover': { overflowX: 'auto' },
    '&::-webkit-scrollbar': { height: '2px' },
    '&::-webkit-scrollbar-track': { backgroundColor: '#eee' },
    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc' },
  },
});

const ScrolledTypography = (props: TypographyProps) => {
  const { root } = useStyles();
  return <Typography classes={{ root }} {...props} />;
};

export default ScrolledTypography;
