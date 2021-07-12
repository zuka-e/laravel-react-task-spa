import { Link as RouterLink } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      color: 'inherit',
      '&:hover': {
        color: 'inherit',
        textDecoration: 'none',
      },
    },
  })
);

const LinkWrapper: React.FC<{ to: string }> = (props) => {
  const { root } = useStyles();

  return (
    <Link component={RouterLink} to={props.to} classes={{ root }}>
      {props.children}
    </Link>
  );
};

export default LinkWrapper;
