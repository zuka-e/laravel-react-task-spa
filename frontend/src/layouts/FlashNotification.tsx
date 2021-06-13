import React, { useEffect, useState } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import { Alert, Color } from '@material-ui/lab';

import { useAppSelector } from 'utils/hooks';

export type FlashNotificationProps = {
  type: Color;
  message: string;
};

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

  // `flash`が初期値のみ場合表示しない
  if (!lastFlash.message) return <React.Fragment />;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      aria-label='flash'
    >
      <Alert onClose={handleClose} severity={lastFlash.type} elevation={12}>
        {lastFlash.message}
      </Alert>
    </Snackbar>
  );
};

export default FlashNotification;
