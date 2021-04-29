import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Container,
  Card,
  Avatar,
  Typography,
  Box,
  Grid,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { APP_NAME } from '../config/app';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      padding: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
    },
    errorBox: {
      marginBottom: theme.spacing(3),
    },
  })
);

const Copyright = () => (
  <Typography variant='body2' color='textSecondary' align='center'>
    © {APP_NAME} {new Date().getFullYear()}
  </Typography>
);

type FormLayoutProps = {
  title: string;
  message?: string;
};

const FormLayout: React.FC<FormLayoutProps> = (props) => {
  const { children, title, message } = props;
  const classes = useStyles();

  const ErrorMessage = () => (
    <Alert className={classes.errorBox} severity='error' elevation={2}>
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );

  return (
    <Container component='main' maxWidth='xs'>
      <Card className={classes.paper} elevation={2}>
        {message && <ErrorMessage />}
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          {title}
        </Typography>
        {children}
      </Card>
      <Box mt={8}>
        <Grid container direction='column' alignItems='center'>
          <Grid item>
            <a href='/terms' target='_blank'>
              Terms
            </a>
            <Box display='inline' borderLeft='1px solid' ml={1} pl={1} />
            <a href='/privacy' target='_blank'>
              Privacy
            </a>
          </Grid>
          <Grid item>
            <Copyright />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default FormLayout;
