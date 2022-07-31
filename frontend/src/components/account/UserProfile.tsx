import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Grid, TextField } from '@material-ui/core';

import { UpdateProfileRequest, updateProfile } from 'store/thunks/auth';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { isGuest } from 'utils/auth';
import { AlertMessage, SubmitButton } from 'templates';

type FormData = UpdateProfileRequest;

const formData: Record<keyof FormData, { id: string; label: string }> = {
  name: {
    id: 'name',
    label: 'Username',
  },
  email: {
    id: 'email',
    label: 'Email Address',
  },
};

const schema = yup.object().shape({
  name: yup.string().label(formData.name.label).min(1).max(255),
  email: yup.string().label(formData.email.label).email().max(255),
});

const UserProfile = () => {
  const user = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    name: useAppSelector((state) => state.auth.user!.name),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    email: useAppSelector((state) => state.auth.user!.email),
  };
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur', resolver: yupResolver(schema) });

  // エラー発生時はメッセージを表示する
  const onSubmit = async (data: FormData) => {
    // フォーカスを当てていない場合`defaultValue`でなく`undefined`となる
    // その場合変更点がないので現在の値をセットする
    if (!data.name) data.name = user.name;
    if (!data.email) data.email = user.email;

    // 全ての項目で変更点がない場合はリクエストを送らない
    if (data.name === user?.name && data.email === user?.email) {
      setMessage('プロフィールが変更されておりません');
      return;
    }

    const response = await dispatch(updateProfile(data));
    if (updateProfile.rejected.match(response))
      setMessage(response.payload?.error?.message);
    else setMessage('');
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
            id={formData.name.id}
            label={formData.name.label}
            autoComplete={formData.name.id}
            defaultValue={user?.name}
            {...register('name')}
            helperText={errors?.name?.message || '1-255 characters'}
            error={!!errors?.name}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest()}
            variant="outlined"
            fullWidth
            id={formData.email.id}
            label={formData.email.label}
            autoComplete={formData.email.id}
            defaultValue={user?.email}
            {...register('email')}
            helperText={errors?.email?.message}
            error={!!errors?.email}
          />
        </Grid>
      </Grid>
      <Box mt={3} mb={1}>
        {!isGuest() && <SubmitButton>プロフィールを更新する</SubmitButton>}
      </Box>
    </form>
  );
};

export default UserProfile;
