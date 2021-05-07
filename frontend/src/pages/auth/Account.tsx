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
} from '@material-ui/core';
import Loading from '../../layouts/Loading';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import UserProfile from '../../components/Account/UserProfile';
import Password from '../../components/Account/Password';
import UserStatus from '../../components/Account/UserStatus';
import { useAuth } from '../../utils/hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
      padding: theme.spacing(3),
    },
  })
);

const Account: React.FC = () => {
  const classes = useStyles();
  const { currentUser, isAuthReady } = useAuth();

  if (!isAuthReady()) return <Loading />;

  return (
    <React.Fragment>
      <Helmet>
        <title>Account | Material Kit</title>
      </Helmet>
      <Header />
      <Container component='main' maxWidth='md'>
        <Card className={classes.card} elevation={2}>
          <Box component='section' mb={3}>
            <CardHeader title='Profile' />
            <Divider />
            <CardContent>
              <UserProfile user={currentUser} />
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
        </Card>
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default Account;
