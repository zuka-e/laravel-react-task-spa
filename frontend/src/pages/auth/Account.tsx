import React from 'react';

import { Helmet } from 'react-helmet-async';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
  Button,
} from '@material-ui/core';

import { APP_NAME } from 'config/app';
import { isGuest } from 'utils/auth';
import { useAppSelector } from 'utils/hooks';
import { Loading, Header, Footer } from 'layouts';
import {
  UserProfile,
  Password,
  UserStatus,
  DeleteAccountDialog,
} from 'components/Account';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
      padding: theme.spacing(3),
    },
    danger: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.error.main,
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
      },
    },
  })
);

const Account: React.FC = () => {
  const classes = useStyles();
  const authIsReady = useAppSelector((state) => !!state.auth.user?.id);

  if (!authIsReady) return <Loading />;

  return (
    <React.Fragment>
      <Helmet>
        <title>Account | {APP_NAME}</title>
      </Helmet>
      <Header />
      <Container component='main' maxWidth='md'>
        <Card className={classes.card} elevation={2}>
          <Box component='section' mb={3}>
            <CardHeader title='Profile' />
            <Divider />
            <CardContent>
              <UserProfile />
            </CardContent>
          </Box>
          <Box component='section' mb={3}>
            <CardHeader title='Password' />
            <Divider />
            <CardContent>
              <Password />
            </CardContent>
          </Box>
          <Box component='section' mb={3}>
            <CardHeader title='Status' />
            <Divider />
            <CardContent>
              <UserStatus />
            </CardContent>
          </Box>
          <Box component='section' mb={3}>
            <CardHeader title='Delete account' />
            <Divider />
            <CardContent>
              <DeleteAccountDialog
                trigger={
                  <Button
                    disabled={isGuest()}
                    variant='contained'
                    className={classes.danger}
                  >
                    アカウントを削除
                  </Button>
                }
              />
            </CardContent>
          </Box>
        </Card>
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default Account;
