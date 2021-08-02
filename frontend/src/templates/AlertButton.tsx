import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button, ButtonProps } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    success: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.success.main,
      '&:hover': {
        backgroundColor: theme.palette.success.dark,
      },
    },
    info: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.info.light,
      '&:hover': {
        backgroundColor: theme.palette.info.main,
      },
    },
    warning: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.warning.main,
      '&:hover': {
        backgroundColor: theme.palette.warning.dark,
      },
    },
    danger: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.error.main,
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
      },
    },
  })
);

type Color = 'success' | 'info' | 'warning' | 'danger';

type AlertButtonProps = {
  color?: ButtonProps['color'] | Color;
} & Omit<ButtonProps, 'color'>;

const AlertButton: React.FC<AlertButtonProps> = (props) => {
  const { color, ...buttonProps } = props;
  const { className, ...alertButtonProps } = buttonProps;
  const classes = useStyles();

  if (
    !color ||
    color === 'inherit' ||
    color === 'default' ||
    color === 'primary' ||
    color === 'secondary'
  )
    return <Button {...buttonProps} />;

  return (
    <Button
      className={
        props.className
          ? `${props.className} ${classes[color]}`
          : classes[color]
      }
      {...alertButtonProps}
    />
  );
};

export default AlertButton;
