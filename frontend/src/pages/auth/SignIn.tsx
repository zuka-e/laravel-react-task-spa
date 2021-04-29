import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Grid,
} from '@material-ui/core';
import { APP_NAME } from '../../config/app';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signInWithEmail } from '../../store/slices/authSlice';
import FormLayout from '../../layouts/FormLayout';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    link: {
      color: theme.palette.info.dark,
    },
    textFieldLabel: {
      marginTop: theme.spacing(-1),
      marginBottom: theme.spacing(2),
      marginLeft: 0,
      color: theme.palette.text.hint,
    },
    divider: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
  })
);

// Input items
type FormData = {
  email: string;
  password: string;
};

// The schema-based form validation with Yup
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(8).max(20),
});

const SignIn: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { signedIn, loading } = useAppSelector((state) => state.auth);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');
  const history = useHistory();
  const {
    register, // 入力項目の登録
    handleSubmit, // 用意された`handleSubmit`
    formState: { errors }, // エラー情報 (メッセージなど)
  } = useForm<FormData>({
    mode: 'onChange', // バリデーション判定タイミング
    resolver: yupResolver(schema),
  });

  // ログイン済みならルートへリダイレクト
  useEffect(() => {
    signedIn && history.replace('/');
  });

  const handleVisiblePassword = () => {
    setVisiblePassword(!visiblePassword);
  };

  // エラー発生時はメッセージを表示する
  const onSubmit = async (data: FormData) => {
    const response = await dispatch(signInWithEmail(data));
    if (signInWithEmail.rejected.match(response)) {
      setMessage(response.payload?.error?.message);
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Sign in | {APP_NAME}</title>
      </Helmet>
      <FormLayout title={`Sign in to ${APP_NAME}`} message={message}>
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
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label='Password'
            type={visiblePassword ? 'text' : 'password'}
            id='password'
            autoComplete='current-password'
            {...register('password')}
            helperText={errors?.password?.message || '8-20 characters'}
            error={!!errors?.password}
          />
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  size='small'
                  color='primary'
                  checked={visiblePassword}
                  onChange={handleVisiblePassword}
                />
              }
              className={classes.textFieldLabel}
              label='Show Password'
            />
          </div>
          <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          />
          <Button
            disabled={loading}
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign In
          </Button>
          <Button size='small' onClick={() => history.push('/forgot-password')}>
            <span className={classes.link}>Forgot password?</span>
          </Button>
          <Divider className={classes.divider} />
          <Grid container justify='flex-end'>
            <Grid item>
              New to {APP_NAME}?&nbsp;
              <Button size='small' onClick={() => history.push('/register')}>
                <span className={classes.link}>Create an account</span>
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormLayout>
    </React.Fragment>
  );
};

export default SignIn;
