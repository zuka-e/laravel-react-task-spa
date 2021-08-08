import { useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Card, Box, Typography, Button } from '@material-ui/core';

import { removeEmailVerificationPage } from 'store/slices/authSlice';
import { sendEmailVerificationLink } from 'store/thunks/auth';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { isAfterRegistration, isVerified } from 'utils/auth';
import { BaseLayout } from 'layouts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
      padding: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  })
);

const EmailVerification = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const afterRegistration = useAppSelector(
    (state) => state.auth.afterRegistration
  );
  const history = useHistory();

  // 一時的に表示させるページ
  // `afterRegistration`: `SignUp`直後に`true` (`replace`しない -> 表示させる)
  useEffect(() => {
    if (!isAfterRegistration() || isVerified()) history.replace('/');
  }, [history, afterRegistration]);

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
    <BaseLayout subtitle='Email Verification'>
      <Container component='main' maxWidth='sm'>
        <Card className={classes.paper} elevation={2}>
          <Box mb={4}>
            <Typography variant='h4' component='h1'>
              認証用メールを送信しました。
            </Typography>
          </Box>
          <Typography paragraph>
            届いたメールに記載されたURLをクリックして登録を完了させてください。メールが受信できない場合は迷惑メールに振り分けられていないかご確認ください。
          </Typography>
          <Typography paragraph>
            1時間以内に手続きを行わなかった場合、メールのリンクは無効になります。
          </Typography>
          <Button variant='contained' color='secondary' onClick={handleClick}>
            メールを再送信する
          </Button>
        </Card>
      </Container>
    </BaseLayout>
  );
};

export default EmailVerification;
