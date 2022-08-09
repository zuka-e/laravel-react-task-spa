import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Card, Grid, Avatar, Typography } from '@material-ui/core';

import { APP_NAME } from 'config/app';
import { AlertMessage } from 'templates';
import { NextLinkComposed } from 'templates/Link';
import logo from 'images/logo_short.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
    },
    error: {
      width: '100%',
      marginBottom: theme.spacing(2),
      whiteSpace: 'pre-wrap',
      fontSize: theme.typography.caption.fontSize,
    },
    paper: { padding: theme.spacing(3) },
    logo: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
    content: {
      width: '100%',
      '& > form': { width: '100%' },
    },
    separator: {
      display: 'inline',
      borderLeft: '1px solid',
      marginLeft: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
  })
);

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
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

  return (
    <React.Fragment>
      <Container className={classes.main} component="main" maxWidth="xs">
        {message && (
          <AlertMessage
            severity="error"
            body={message}
            className={classes.error}
          />
        )}
        <Card classes={{ root: classes.paper }} elevation={2}>
          <Grid container direction="column" alignItems="center">
            <Avatar
              className={classes.logo}
              component={NextLinkComposed}
              to="/"
              src={logo.src}
              alt={APP_NAME}
              title={APP_NAME}
            />
            <Typography component="h1" variant="h5" gutterBottom>
              {title}
            </Typography>
            <div className={classes.content}>{children}</div>
          </Grid>
        </Card>
      </Container>
      <footer>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <a href="/terms" target="_blank">
              {'Terms'}
            </a>
            <div className={classes.separator} />
            <a href="/privacy" target="_blank">
              {'Privacy'}
            </a>
          </Grid>
          <Grid item>
            <Copyright />
          </Grid>
        </Grid>
      </footer>
    </React.Fragment>
  );
};

export default FormLayout;
