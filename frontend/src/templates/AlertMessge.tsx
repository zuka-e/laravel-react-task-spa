import { Alert, AlertTitle, Color } from '@material-ui/lab';

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
  elevetion?: number;
  action?: React.ReactNode;
  title?: string;
  body?: string;
};

const AlertMessage: React.FC<AlertMessageProps> = (props) => {
  const { children, severity, elevetion, action, title, body } = props;
  const defaultTitle = makeDefaultTitle(severity);

  return (
    <Alert severity={severity} elevation={elevetion || 2} action={action}>
      <AlertTitle>{title || defaultTitle}</AlertTitle>
      {body || children}
    </Alert>
  );
};

export default AlertMessage;
