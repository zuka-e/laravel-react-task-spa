import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export type FlashMessageProps = {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
};

const FlashMessage: React.FC<FlashMessageProps> = (props) => {
  const { type, message } = props;
  const [open, setOpen] = useState(true);

  // `message`の変更を監視
  useEffect(() => {
    setOpen(true);
  }, [message]);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={type} elevation={12}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default FlashMessage;
