import { useState } from 'react';

import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Divider, Grid, Box } from '@material-ui/core';

import {
  ResetPasswordRequest,
  resetPassword,
  signInWithEmail,
} from 'store/thunks/auth';
import { useAppDispatch, useQuery } from 'utils/hooks';
import { BaseLayout, FormLayout } from 'layouts';
import { AlertButton, LabeledCheckbox, SubmitButton } from 'templates';

type FormData = ResetPasswordRequest;

const formData = {
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

const ResetPassword = () => {
  const query = useQuery();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      email: query.get('email') || '',
      token: query.get('token') || '',
    },
    // `defaultValues`はフォーム入力では変更不可
  });

  // エラー発生時はメッセージを表示する
  const onSubmit = async (data: FormData) => {
    const response = await dispatch(resetPassword(data));
    if (resetPassword.rejected.match(response))
      setMessage(response.payload?.error?.message);
    // 認証成功時は自動ログイン
    else
      dispatch(signInWithEmail({ email: data.email, password: data.password }));
  };

  return (
    <BaseLayout subtitle="Reset Password" withoutHeaders>
      <FormLayout title={'Reset Password'} message={message}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id={formData.password.id}
            label={formData.password.label}
            type={visiblePassword ? 'text' : 'password'}
            autoComplete={formData.password.id}
            {...register('password')}
            helperText={errors?.password?.message || '8-20 characters'}
            error={!!errors?.password}
          />
          <TextField
            variant="outlined"
            // margin='normal'
            required
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
          <Box ml={1} mb={2}>
            <LabeledCheckbox
              label="Show Password"
              checked={visiblePassword}
              setChecked={setVisiblePassword}
            />
          </Box>
          <Box my={4}>
            <SubmitButton fullWidth>{'Reset Password'}</SubmitButton>
          </Box>
          <Box mb={2}>
            <Divider />
          </Box>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <AlertButton
                color="info"
                variant="text"
                size="small"
                onClick={() => history.push('/')}
              >
                {'Cancel'}
              </AlertButton>
            </Grid>
          </Grid>
        </form>
      </FormLayout>
    </BaseLayout>
  );
};

export default ResetPassword;
