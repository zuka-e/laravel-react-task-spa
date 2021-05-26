import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button, Divider, Grid, Box } from '@material-ui/core';
import { APP_NAME } from '../../config/app';
import { useQuery } from '../../utils/hooks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetPassword, signInWithEmail } from '../../store/slices/authSlice';
import FormLayout from '../../layouts/FormLayout';
import LabeledCheckbox from '../../templates/LabeledCheckbox';

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
  password_confirmation: string;
  token: string;
};

// The schema-based form validation with Yup
const schema = yup.object().shape({
  password: yup.string().required().min(8).max(20),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
});

const ResetPassword: React.FC = () => {
  const classes = useStyles();
  const query = useQuery();
  const history = useHistory();
  const token = query.get('token') || '';
  const email = query.get('email') || '';
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register, // 入力項目の登録
    handleSubmit, // 用意された`handleSubmit`
    formState: { errors }, // エラー情報 (メッセージなど)
  } = useForm<FormData>({
    mode: 'onChange', // バリデーション判定タイミング
    resolver: yupResolver(schema),
    defaultValues: { email: email, token: token },
    // `defaultValues`はフォーム入力では変更不可
  });

  // エラー発生時はメッセージを表示する
  const onSubmit = async (data: FormData) => {
    const response = await dispatch(resetPassword(data));
    if (resetPassword.rejected.match(response)) {
      setMessage(response.payload?.error?.message);
    } else {
      // 認証成功時は自動ログイン
      dispatch(
        signInWithEmail({ email, password: data.password, remember: undefined })
      );
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Reset Password | {APP_NAME}</title>
      </Helmet>
      <FormLayout title={'Reset Password'} message={message}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
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
          <TextField
            variant='outlined'
            // margin='normal'
            required
            fullWidth
            label='Password Confirmation'
            type={visiblePassword ? 'text' : 'password'}
            id='password-confirmation'
            autoComplete='password-confirmation'
            {...register('password_confirmation')}
            helperText={
              errors?.password_confirmation?.message || 'Retype password'
            }
            error={!!errors?.password_confirmation}
          />
          <Box ml={1} mb={2}>
            <LabeledCheckbox
              state={visiblePassword}
              setState={setVisiblePassword}
            >
              Show Password
            </LabeledCheckbox>
          </Box>
          <Button
            disabled={loading}
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Reset Password
          </Button>
          <Divider className={classes.divider} />
          <Grid container justify='flex-end'>
            <Grid item>
              <Button size='small' onClick={() => history.push('/')}>
                <span className={classes.link}>Cancel</span>
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormLayout>
    </React.Fragment>
  );
};

export default ResetPassword;
