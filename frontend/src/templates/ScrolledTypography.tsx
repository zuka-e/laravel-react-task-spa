import { makeStyles } from '@material-ui/core/styles';
import { Typography, TypographyProps } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    '&:hover': { overflowX: 'auto' },
    '&::-webkit-scrollbar': { height: '0px' },
  },
});

const ScrolledTypography = (props: TypographyProps) => {
  const { classes, ...typographyProps } = props;
  const styles = useStyles();
  const root = classes?.root ? `${styles.root} ${classes.root}` : styles.root;

  return <Typography classes={{ ...classes, root }} {...typographyProps} />;
};

export default ScrolledTypography;
