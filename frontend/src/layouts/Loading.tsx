import { Fragment } from 'react';

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

const Loading = () => {
  const classes = useStyles();
  const loading = useAppSelector((state) => state.auth.loading);

  if (!loading) return <Fragment />;

  return (
    <Backdrop className={classes.backdrop} open={!!loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
