import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Grid, TextField } from '@material-ui/core';

import { UpdatePasswordRequest, updatePassword } from 'store/thunks/auth';
import { useAppDispatch } from 'utils/hooks';
import { isGuest } from 'utils/auth';
import { LabeledCheckbox, AlertMessage, SubmitButton } from 'templates';

type FormData = UpdatePasswordRequest;

const formData: Record<keyof FormData, { id: string; label: string }> = {
  current_password: {
    id: 'current-password',
    label: 'Current Password',
  },
  password: {
    id: 'new-password',
    label: 'New Password',
  },
  password_confirmation: {
    id: 'password-confirmation',
    label: 'Password Confirmation',
  },
};

const schema = yup.object().shape({
  current_password: yup
    .string()
    .label(formData.current_password.label)
    .required(),
  password: yup
    .string()
    .label(formData.password.label)
    .required()
    .min(8)
    .max(20),
  password_confirmation: yup
    .string()
    .label(formData.password_confirmation.label)
    .oneOf([yup.ref('password'), null], 'Passwords do not match'),
});

const Password = () => {
  const dispatch = useAppDispatch();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur', resolver: yupResolver(schema) });

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
          {message && <AlertMessage severity="error" body={message} />}
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest()}
            variant="outlined"
            fullWidth
            id={formData.current_password.id}
            label={formData.current_password.label}
            type={visiblePassword ? 'text' : 'password'}
            autoComplete={formData.current_password.id}
            {...register('current_password')}
            helperText={errors?.current_password?.message || ' '}
            error={!!errors?.current_password}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest()}
            variant="outlined"
            fullWidth
            id={formData.password.id}
            label={formData.password.label}
            type={visiblePassword ? 'text' : 'password'}
            autoComplete={formData.password.id}
            {...register('password')}
            helperText={errors?.password?.message || '8-20 characters'}
            error={!!errors?.password}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest()}
            variant="outlined"
            fullWidth
            id={formData.password_confirmation.id}
            label={formData.password_confirmation.label}
            type={visiblePassword ? 'text' : 'password'}
            autoComplete={formData.password_confirmation.id}
            {...register('password_confirmation')}
            helperText={
              errors?.password_confirmation?.message || 'Retype password'
            }
            error={!!errors?.password_confirmation}
          />
        </Grid>
      </Grid>
      <Box ml={1} mb={2}>
        <LabeledCheckbox
          label="Show Password"
          checked={visiblePassword}
          setChecked={setVisiblePassword}
        />
      </Box>
      {!isGuest() && <SubmitButton>パスワードを変更する</SubmitButton>}
    </form>
  );
};

export default Password;
