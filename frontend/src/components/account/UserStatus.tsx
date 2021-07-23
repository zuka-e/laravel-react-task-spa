import React from 'react';

import { Box, Button, Grid } from '@material-ui/core';

import { sendEmailVerificationLink } from 'store/thunks/auth';
import { useAppDispatch } from 'utils/hooks';
import { isVerified } from 'utils/auth';
import { AlertMessage } from 'templates';

const UserStatus: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(sendEmailVerificationLink());
  };

  const showEmailVerificationState = () => {
    return isVerified() ? (
      <AlertMessage severity='success' body='認証済みです' />
    ) : (
      <React.Fragment>
        <AlertMessage severity='warning' body='メール認証が必要です' />
        <Box mt={3} mb={1}>
          <Button variant='contained' color='secondary' onClick={handleClick}>
            メールを再送信する
          </Button>
        </Box>
      </React.Fragment>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        {showEmailVerificationState()}
      </Grid>
    </Grid>
  );
};

export default UserStatus;