import { makeStyles } from '@material-ui/core/styles';

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

type ScrolledDivProps = ScrollProps &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const ScrolledDiv = (props: ScrolledDivProps) => {
  const { className, ...other } = props;
  const { root } = useStyles(props);
  return <div className={`${root} ${className || ''}`} {...other} />;
};

export default ScrolledDiv;
