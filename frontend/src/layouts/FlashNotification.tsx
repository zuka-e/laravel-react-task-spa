import React, { useEffect, useState } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';

import { useDeepEqualSelector } from 'utils/hooks';

const FlashNotification = () => {
  const [open, setOpen] = useState(false);
  const flash = useDeepEqualSelector((state) => state.auth.flash);
  const lastFlash = flash.slice(-1)[0];

  // `flash`(store) の変更を監視
  useEffect(() => setOpen(true), [flash]);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    else setOpen(false);
  };

  // `flash`が初期値の場合表示しない
  if (flash.length === 0) return <React.Fragment />;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      aria-label="flash"
    >
      <Alert onClose={handleClose} severity={lastFlash.type} elevation={12}>
        {lastFlash.message}
      </Alert>
    </Snackbar>
  );
};

export default FlashNotification;
