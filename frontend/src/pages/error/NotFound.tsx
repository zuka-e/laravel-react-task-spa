import React from 'react';

import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Typography, Button } from '@material-ui/core';

import { APP_NAME } from 'config/app';
import { Header, Footer } from 'layouts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(7),
      marginBottom: theme.spacing(5),
    },
  })
);

const NotFound = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <React.Fragment>
      <Helmet>
        <title>404 Not Found | {APP_NAME}</title>
      </Helmet>
      <Header />
      <Container component='main' maxWidth='md' className={classes.container}>
        <Typography component='h1' variant='h1' paragraph>
          404 Page Not Found
        </Typography>
        <Typography component='h2' variant='h2' color='textSecondary' paragraph>
          ページが見つかりませんでした。
        </Typography>
        <Typography color='textSecondary' paragraph>
          お探しのページは移動または削除された可能性があります。
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={() => history.push('/')}
        >
          トップページへ戻る
        </Button>
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default NotFound;
