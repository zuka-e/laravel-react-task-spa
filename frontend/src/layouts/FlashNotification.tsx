import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { useAppSelector } from '../store/hooks';

const FlashNotification = () => {
  const { flash } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(true);

  const lastFlash = flash.slice(-1)[0];

  // `flash`(store) の変更を監視
  useEffect(() => {
    setOpen(true);
  }, [flash]);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  if (!lastFlash.message) return <></>;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={lastFlash.type} elevation={12}>
        {lastFlash.message}
      </Alert>
    </Snackbar>
  );
};

export default FlashNotification;
