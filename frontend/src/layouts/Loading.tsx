import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { useAppSelector } from '../store/hooks';

const useStyles = makeStyles((theme) =>
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
