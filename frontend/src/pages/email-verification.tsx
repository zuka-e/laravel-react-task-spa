import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Card, Grid, Typography, Button } from '@material-ui/core';

import { removeEmailVerificationPage } from 'store/slices/authSlice';
import { sendEmailVerificationLink } from 'store/thunks/auth';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { isAfterRegistration, isVerified } from 'utils/auth';
import { BaseLayout } from 'layouts';
import { AlertMessage } from 'templates';
import type { AuthPage } from 'routes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
    },
    paper: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(4),
    },
  })
);

type EmailVerificationProps = AuthPage;

export const getStaticProps: GetStaticProps<
  EmailVerificationProps
> = async () => {
  return {
    props: {
      auth: true,
    },
    revalidate: 10,
  };
};

const EmailVerification = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const afterRegistration = useAppSelector(
    (state) => state.auth.afterRegistration
  );
  const router = useRouter();

  // 一時的に表示させるページ
  // `afterRegistration`: `SignUp`直後に`true` (`replace`しない -> 表示させる)
  useEffect(() => {
    if (!isAfterRegistration() || isVerified()) router.replace('/');
  }, [router, afterRegistration]);

  // DOMアンマウント時に実行 (cleanup function)
  useEffect(() => {
    return () => {
      dispatch(removeEmailVerificationPage());
    };
  }, [dispatch]);

  const handleClick = () => {
    dispatch(sendEmailVerificationLink());
  };

  return (
    <>
      <Head>
        <title>Email Verification</title>
      </Head>
      <BaseLayout>
        <Container className={classes.main} component="main" maxWidth="sm">
          <AlertMessage severity="warning" elevation={2}>
            <strong>
              {`登録から24時間以内に認証を完了させなかった場合、一定時間経過後に登録が抹消されます。`}
            </strong>
          </AlertMessage>
          <Card classes={{ root: classes.paper }} elevation={2}>
            <Grid container direction="column" alignItems="center">
              <Typography variant="h4" component="h1" gutterBottom>
                {`認証用メールを送信しました。`}
              </Typography>
              <Typography paragraph>
                {`届いたメールに記載されたURLをクリックして登録を完了させてください。メールが受信できない場合は迷惑メールに振り分けられていないかご確認ください。`}
              </Typography>
              <Typography paragraph>
                {`1時間以内に手続きを行わなかった場合、メールのリンクは無効になります。`}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClick}
              >
                {`メールを再送信する`}
              </Button>
            </Grid>
          </Card>
        </Container>
      </BaseLayout>
    </>
  );
};

export default EmailVerification;
