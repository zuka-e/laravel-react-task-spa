import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Card, Box, Typography, Button } from '@material-ui/core';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import { APP_NAME } from '../../config/app';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteSentEmailState } from 'store/slices/authSlice';
import { sendEmailVerificationLink } from 'store/thunks/sendEmailVerificationLink';
import { isSentEmail, isVerified } from '../../utils/auth';

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

const EmailVerification: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { sentEmail } = useAppSelector((state) => state.auth);
  const history = useHistory();

  // 一時的に表示させるページ
  // `sentEmail`: `SignUp`直後に`true` (`replace`しない -> 表示させる)
  useEffect(() => {
    if (!isSentEmail() || isVerified()) history.replace('/');
  }, [history, sentEmail]);

  // DOMアンマウント時に実行 (cleanup function)
  useEffect(() => {
    return () => {
      dispatch(deleteSentEmailState());
    };
  }, [dispatch]);

  const handleClick = () => {
    dispatch(sendEmailVerificationLink());
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Email Verification | {APP_NAME}</title>
      </Helmet>
      <Header />
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
      <Footer />
    </React.Fragment>
  );
};

export default EmailVerification;
