import { Alert, AlertProps, AlertTitle, Color } from '@material-ui/lab';

const headerMap: Record<Color, Capitalize<Color>> = {
  success: 'Success',
  info: 'Info',
  warning: 'Warning',
  error: 'Error',
};

type AlertMessageProps = {
  severity: Color;
  header?: string;
  body?: string;
} & AlertProps;

const AlertMessage = (props: AlertMessageProps) => {
  const { header, body, ...alertProps } = props;
  const title = props.header || headerMap[props.severity];

  return (
    <Alert elevation={2} {...alertProps}>
      <AlertTitle title={title}>{title}</AlertTitle>
      {props.body || props.children}
    </Alert>
  );
};

export default AlertMessage;
