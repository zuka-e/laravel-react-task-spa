import { makeStyles } from '@material-ui/core/styles';
import { Grid, GridProps } from '@material-ui/core';

type ScrollProps = {
  hover?: boolean;
  small?: boolean;
};

const useStyles = makeStyles({
  root: {
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-track': { backgroundColor: '#eee' },
    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc' },
  },
  hover: {
    overflow: 'hidden',
    '&:hover': {
      overflow: 'auto',
    },
  },
  small: {
    '&::-webkit-scrollbar': {
      width: '2px',
      height: '2px',
    },
  },
});

const ScrolledGridContainer = (props: GridProps & ScrollProps) => {
  const classes = useStyles();

  const makeClasses = () => {
    let className = classes.root;
    if (props.hover) className += ` ${classes.hover}`;
    if (props.small) className += ` ${classes.small}`;

    return { root: className };
  };

  return <Grid container wrap='nowrap' classes={makeClasses()} {...props} />;
};

export default ScrolledGridContainer;
