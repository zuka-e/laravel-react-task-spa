import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
} from '@material-ui/core';

import { isGuest } from 'utils/auth';
import { BaseLayout } from 'layouts';
import { AlertButton } from 'templates';
import {
  UserProfile,
  Password,
  UserStatus,
  DeleteAccountDialog,
} from 'components/account';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
      padding: theme.spacing(3),
    },
  })
);

const Account = () => {
  const classes = useStyles();

  return (
    <BaseLayout subtitle="Account">
      <Container component="main" maxWidth="md">
        <Card className={classes.card} elevation={2}>
          <Box component="section" mb={3}>
            <CardHeader title="Profile" />
            <Divider />
            <CardContent>
              <UserProfile />
            </CardContent>
          </Box>
          <Box component="section" mb={3}>
            <CardHeader title="Password" />
            <Divider />
            <CardContent>
              <Password />
            </CardContent>
          </Box>
          <Box component="section" mb={3}>
            <CardHeader title="Status" />
            <Divider />
            <CardContent>
              <UserStatus />
            </CardContent>
          </Box>
          <Box component="section" mb={3}>
            <CardHeader title="Delete account" />
            <Divider />
            <CardContent>
              <DeleteAccountDialog
                trigger={
                  <AlertButton disabled={isGuest()} color="danger">
                    アカウントを削除
                  </AlertButton>
                }
              />
            </CardContent>
          </Box>
        </Card>
      </Container>
    </BaseLayout>
  );
};

export default Account;
