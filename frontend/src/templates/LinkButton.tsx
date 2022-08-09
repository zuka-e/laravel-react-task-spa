import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, ButtonProps, ButtonTypeMap } from '@material-ui/core';

import { NextLinkComposed } from 'templates/Link';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contained: {
      textDecoration: 'none',
      '&:hover': { textDecoration: 'none' },
    },
    containedPrimary: {
      '&:hover': { color: theme.palette.primary.contrastText },
    },
    containedSecondary: {
      '&:hover': { color: theme.palette.secondary.contrastText },
    },
  })
);

type LinkButtonProps = {
  to: string;
} & ButtonProps<
  ButtonTypeMap<Record<string, unknown>, 'a'>['defaultComponent']
>;

const LinkButton = (props: LinkButtonProps) => {
  const { to, classes, ...buttonProps } = props;
  const defaultClasses = useStyles();

  return (
    <Button
      classes={{ ...defaultClasses, ...classes }}
      variant="contained"
      color="primary"
      component={NextLinkComposed}
      to={to}
      {...buttonProps}
    />
  );
};

export default LinkButton;
