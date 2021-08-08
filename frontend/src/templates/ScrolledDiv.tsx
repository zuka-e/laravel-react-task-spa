import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    overflow: 'auto',
    '&::-webkit-scrollbar': { width: '8px', height: '8px' },
    '&::-webkit-scrollbar-track': { backgroundColor: '#eee' },
    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc' },
  },
});

const ScrolledDiv = (props: JSX.IntrinsicElements['div']) => {
  const { className, ...other } = props;
  const classes = useStyles();

  return (
    <div
      className={className ? `${classes.root} ${className}` : classes.root}
      {...other}
    />
  );
};

export default ScrolledDiv;
