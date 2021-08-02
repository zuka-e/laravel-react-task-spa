import { Alert, AlertProps, AlertTitle, Color } from '@material-ui/lab';

const makeDefaultTitle = (severity: Color) => {
  switch (severity) {
    case 'success':
      return 'Success';
    case 'info':
      return 'Info';
    case 'warning':
      return 'Warning';
    case 'error':
      return 'Error';
  }
};

type AlertMessageProps = {
  severity: Color;
  title?: string;
  body?: string;
} & AlertProps;

const AlertMessage: React.FC<AlertMessageProps> = (props) => {
  const { title, body, ...alertProps } = props;

  return (
    <Alert elevation={2} {...alertProps}>
      <AlertTitle>{props.title || makeDefaultTitle(props.severity)}</AlertTitle>
      {props.body || props.children}
    </Alert>
  );
};

export default AlertMessage;
