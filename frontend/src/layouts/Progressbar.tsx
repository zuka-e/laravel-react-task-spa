import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { LinearProgress, LinearProgressProps } from '@material-ui/core';

import { useAppSelector } from 'utils/hooks';

const useStyles = makeStyles((theme: Theme) => ({
  root: { marginTop: theme.spacing(1) },
}));

const Progressbar = (props: LinearProgressProps) => {
  const { root } = useStyles();
  const loading = useAppSelector(
    (state) => state.auth.loading || state.boards.loading
  );

  if (loading)
    return (
      <LinearProgress
        classes={{ root }}
        variant='query'
        color='secondary'
        {...props}
      />
    );
  else return <React.Fragment />;
};

export default Progressbar;
