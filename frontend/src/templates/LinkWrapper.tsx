import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';

const LinkWrapper: React.FC<{ to: string }> = (props) => {
  const useStyles = makeStyles({
    root: {
      color: 'inherit',
      '&:hover': {
        color: 'inherit',
        textDecoration: 'none',
      },
    },
  });
  const { root } = useStyles();

  return (
    <Link component={RouterLink} to={props.to} classes={{ root }}>
      {props.children}
    </Link>
  );
};

export default LinkWrapper;
