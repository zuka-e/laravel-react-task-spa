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
  color: Color;
} & Omit<ButtonProps, 'color' | 'variant'>;

const AlertButton: React.FC<AlertButtonProps> = (props) => {
  const { color, className, ...buttonProps } = props;
  const classes = useStyles();

  return (
    <Button
      className={className ? `${className} ${classes[color]}` : classes[color]}
      variant='contained'
      {...buttonProps}
    />
  );
};

export default AlertButton;
