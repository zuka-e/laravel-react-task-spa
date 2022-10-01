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

type HttpErrorLayoutProps = {
  title: string;
  description: string;
  hint?: string;
  children?: React.ReactNode;
};

const HttpErrorLayout = (props: HttpErrorLayoutProps) => {
  const { title, description, hint, children } = props;
  const classes = useStyles();
  const router = useRouter();

  const handleClick = () => {
    router.push(router.asPath === '/' ? '#' : '/');
  };

  return (
    <BaseLayout subtitle={title}>
      <Container component="main" maxWidth="md" className={classes.container}>
        <Typography variant="h1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h2" gutterBottom color="textSecondary">
          {description}
        </Typography>
        {hint && (
          <Typography color="textSecondary" paragraph>
            {hint}
          </Typography>
        )}
        {children}
        <Button variant="contained" color="primary" onClick={handleClick}>
          トップページへ戻る
        </Button>
      </Container>
    </BaseLayout>
  );
};

export default HttpErrorLayout;
