import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@material-ui/core';
import { APP_NAME } from '../../config/app';

const NotFound = () => {
  const history = useHistory();

  return (
    <React.Fragment>
      <Helmet>
        <title>404 Not Found | {APP_NAME}</title>
      </Helmet>
      <Box component={'main'} my={4}>
        <Container maxWidth='md'>
          <Typography component='h1' variant='h1' paragraph>
            404 Page Not Found
          </Typography>
          <Typography
            component='h2'
            variant='h2'
            color='textSecondary'
            paragraph
          >
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
      </Box>
    </React.Fragment>
  );
};

export default NotFound;
