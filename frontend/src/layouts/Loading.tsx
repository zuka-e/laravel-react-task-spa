import { Fragment, useEffect } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';

import { useAppSelector } from 'utils/hooks';
import { initializeAuthState, isReady } from 'utils/auth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
);

const Loading = () => {
  const classes = useStyles();
  const signedIn = useAppSelector((state) => state.auth.signedIn);
  const loading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    initializeAuthState();
  }, [signedIn]);

  if (isReady() && !loading) return <Fragment />;

  return (
    <Backdrop className={classes.backdrop} open={!!loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
