import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Grid, TextField } from '@material-ui/core';
import { useAppDispatch } from '../../store/hooks';
import { updatePassword } from '../../store/slices/authSlice';
import LabeledCheckbox from '../../templates/LabeledCheckbox';
import AlertMessage from '../../templates/AlertMessge';
import SubmitButton from '../../templates/SubmitButton';
import { isGuest } from '../../utils/auth';

// Input items
type FormData = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

// The schema-based form validation with Yup
const schema = yup.object().shape({
  current_password: yup.string().required(),
  password: yup.string().required().min(8).max(20),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
});

const Password: React.FC = () => {
  const dispatch = useAppDispatch();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register, // 入力項目の登録
    handleSubmit, // 用意された`handleSubmit`
    reset,
    formState: { errors }, // エラー情報 (メッセージなど)
  } = useForm<FormData>({
    mode: 'onBlur', // バリデーション判定タイミング
    resolver: yupResolver(schema),
  });

  // エラー発生時はメッセージを表示する
  const onSubmit = async (data: FormData) => {
    const response = await dispatch(updatePassword(data));
    if (updatePassword.rejected.match(response)) {
      setMessage(response.payload?.error?.message);
    } else {
      setMessage('');
      reset(); // フォームの値 (エラー値含む) を消去
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {message && <AlertMessage severity='error' body={message} />}
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest()}
            variant='outlined'
            margin='normal'
            fullWidth
            id='current_password'
            label='Current Password'
            type={visiblePassword ? 'text' : 'password'}
            autoComplete='current_password'
            {...register('current_password')}
            helperText={errors?.current_password?.message}
            error={!!errors?.current_password}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest()}
            variant='outlined'
            margin='normal'
            fullWidth
            id='password'
            label='New Password'
            type={visiblePassword ? 'text' : 'password'}
            autoComplete='password'
            {...register('password')}
            helperText={errors?.password?.message || '8-20 characters'}
            error={!!errors?.password}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest()}
            variant='outlined'
            margin='normal'
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
        </Grid>
      </Grid>
      <Box ml={1} mb={2}>
        <LabeledCheckbox state={visiblePassword} setState={setVisiblePassword}>
          Show Password
        </LabeledCheckbox>
      </Box>
      <Box mb={1}>
        {!isGuest() && (
          <SubmitButton color='secondary'>パスワードを変更する</SubmitButton>
        )}
      </Box>
    </form>
  );
};

export default Password;
