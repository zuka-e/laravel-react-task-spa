import { useRouter } from 'next/router';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Typography, Button } from '@material-ui/core';

import { BaseLayout } from 'layouts';

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
  const router = useRouter();

  return (
    <BaseLayout subtitle="404 Not Found">
      <Container component="main" maxWidth="md" className={classes.container}>
        <Typography variant="h1" gutterBottom>
          404 Page Not Found
        </Typography>
        <Typography variant="h2" gutterBottom color="textSecondary">
          ページが見つかりませんでした。
        </Typography>
        <Typography color="textSecondary" paragraph>
          お探しのページは移動または削除された可能性があります。
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/')}
        >
          トップページへ戻る
        </Button>
      </Container>
    </BaseLayout>
  );
};

export default NotFound;
