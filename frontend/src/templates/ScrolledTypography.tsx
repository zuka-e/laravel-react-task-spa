import { makeStyles } from '@material-ui/core/styles';
import { Typography, TypographyProps } from '@material-ui/core';

type FontProps = {
  fontSize?: string;
};

const useStyles = makeStyles({
  root: {
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    '&:hover': { overflowX: 'auto' },
    '&::-webkit-scrollbar': { height: '2px' },
    '&::-webkit-scrollbar-track': { backgroundColor: '#eee' },
    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc' },
    fontSize: (prop: FontProps) => prop.fontSize,
  },
});

const ScrolledTypography = (props: TypographyProps & FontProps) => {
  const { root } = useStyles(props);
  return <Typography classes={{ root }} {...props} />;
};

export default ScrolledTypography;
