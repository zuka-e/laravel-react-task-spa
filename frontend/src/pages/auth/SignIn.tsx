import React, { useState } from 'react';
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
  Box,
} from '@material-ui/core';
import { APP_NAME } from '../../config/app';
import { useAppDispatch } from 'utils/hooks';
import { signInWithEmail } from 'store/thunks';
import FormLayout from '../../layouts/FormLayout';
import LabeledCheckbox from '../../templates/LabeledCheckbox';
import SubmitButton from 'templates/SubmitButton';

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
  password: string;
  remember: string | undefined;
};

// The schema-based form validation with Yup
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(8).max(20),
});

const SignIn: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
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

  // エラー発生時はメッセージを表示する
  const onSubmit = async (data: FormData) => {
    const response = await dispatch(signInWithEmail(data));
    if (signInWithEmail.rejected.match(response)) {
      setMessage(response.payload?.error?.message);
    } else history.goBack();
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
          <Box ml={1} mb={2}>
            <LabeledCheckbox
              state={visiblePassword}
              setState={setVisiblePassword}
            >
              Show Password
            </LabeledCheckbox>
          </Box>
          <FormControlLabel
            control={
              <Checkbox {...register('remember')} value='on' color='primary' />
            }
            label='Remember me'
          />
          <Box mt={4} mb={3}>
            <SubmitButton fullWidth> Sign In</SubmitButton>
          </Box>
          <Button size='small' onClick={() => history.push('/forgot-password')}>
            <span className={classes.link}>Forgot password?</span>
          </Button>
          <Box mt={1} mb={2}>
            <Divider />
          </Box>
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
