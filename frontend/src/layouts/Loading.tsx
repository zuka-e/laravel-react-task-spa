import React, { useEffect, useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';

import { useAppSelector } from 'utils/hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
);

const Loading: React.FC = () => {
  const classes = useStyles();
  const { loading } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!loading);
  }, [loading]);

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color='inherit' />
    </Backdrop>
  );
};

export default Loading;
