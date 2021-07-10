import { makeStyles } from '@material-ui/core/styles';

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

type ScrolledDivProps = ScrollProps &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const ScrolledDiv = (props: ScrolledDivProps) => {
  const { className, ...other } = props;
  const classes = useStyles();

  const makeClassName = () => {
    let className = classes.root;
    if (props.hover) className += ` ${classes.hover}`;
    if (props.small) className += ` ${classes.small}`;
    if (props.className) className += ` ${props.className}`;

    return className;
  };

  return <div className={makeClassName()} {...other} />;
};

export default ScrolledDiv;
