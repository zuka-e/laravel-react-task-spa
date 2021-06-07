import React, { useState } from 'react';

import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button, Divider, Grid, Box } from '@material-ui/core';

import { APP_NAME } from 'config/app';
import { forgotPassword } from 'store/thunks';
import { useAppDispatch } from 'utils/hooks';
import { FormLayout } from 'layouts';
import { SubmitButton } from 'templates';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    link: {
      color: theme.palette.info.dark,
    },
  })
);

// Input items
type FormData = {
  email: string;
};

// The schema-based form validation with Yup
const schema = yup.object().shape({
  email: yup.string().email().required(),
});

const ForgotPassword: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register, // 入力項目の登録
    handleSubmit, // 用意された`handleSubmit`
    formState: { errors }, // エラー情報 (メッセージなど)
  } = useForm<FormData>({
    mode: 'onChange', // バリデーション判定タイミング
    resolver: yupResolver(schema),
  });

  // エラー発生時はメッセージを表示する
  const onSubmit = async (data: FormData) => {
    const response = await dispatch(forgotPassword(data));
    if (forgotPassword.rejected.match(response)) {
      setMessage(response.payload?.error?.message);
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Forgot Password | {APP_NAME}</title>
      </Helmet>
      <FormLayout title={'Forgot Password?'} message={message}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            autoComplete='email'
            {...register('email')}
            helperText={errors?.email?.message}
            error={!!errors?.email}
          />
          <Box mt={4} mb={3}>
            <SubmitButton fullWidth>Send password reset email</SubmitButton>
          </Box>
          <Box mt={1} mb={2}>
            <Divider />
          </Box>
          <Grid container justify='flex-end'>
            <Grid item>
              Back to
              <Button size='small' onClick={() => history.push('/login')}>
                <span className={classes.link}>Sign in</span>
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormLayout>
    </React.Fragment>
  );
};

export default ForgotPassword;
