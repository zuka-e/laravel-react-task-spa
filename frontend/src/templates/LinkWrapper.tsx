import { Link as RouterLink } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Link, LinkProps } from '@material-ui/core';

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

type LinkWrapperProps = {
  to: string;
} & LinkProps;

const LinkWrapper = (props: LinkWrapperProps) => {
  const { to, ...linkProps } = props;
  const { root } = useStyles();

  return (
    <Link
      classes={{ root }}
      component={RouterLink}
      to={props.to}
      {...linkProps}
    />
  );
};

export default LinkWrapper;
