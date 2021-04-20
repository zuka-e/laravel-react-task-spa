import React from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Divider,
  Grid,
} from '@material-ui/core';
import FormLayout from './FormLayout';
import { APP_NAME } from '../../config/app';

const useStyles = makeStyles((theme) => ({
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
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));

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
  const history = useHistory();
  const {
    register, // 入力項目の登録
    handleSubmit, // 用意された`handleSubmit`
    formState: { errors }, // エラー情報 (メッセージなど)
  } = useForm<FormData>({
    mode: 'onChange', // バリデーション判定タイミング
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    //
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Sign in | {APP_NAME}</title>
      </Helmet>
      <FormLayout title={`Sign in to ${APP_NAME}`}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            autoComplete='email'
            autoFocus
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
            type='password'
            id='password'
            autoComplete='current-password'
            {...register('password')}
            helperText={errors?.password?.message || '8-20 characters'}
            error={!!errors?.password}
          />
          <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          />
          <Button
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
              <Typography display='inline' variant='body2'>
                New to {APP_NAME}?&nbsp;
              </Typography>
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
