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

const formdata: Record<keyof FormData, { id: string; label: string }> = {
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
  name: yup.string().label(formdata.name.label).min(2).max(60),
  email: yup.string().label(formdata.email.label).email().max(255),
});

const UserProfile = () => {
  /**
   * `Account`ページは認証ルートのため以下が成立
   * - `signedIn` === `true` && `user`!== `null` -> `user!`
   */
  const user = {
    name: useAppSelector((state) => state.auth.user!.name),
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
          {message && <AlertMessage severity='error' body={message} />}
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest()}
            variant='outlined'
            fullWidth
            id={formdata.name.id}
            label={formdata.name.label}
            autoComplete={formdata.name.id}
            defaultValue={user?.name}
            {...register('name')}
            helperText={errors?.name?.message || '2-60 characters'}
            error={!!errors?.name}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest()}
            variant='outlined'
            fullWidth
            id={formdata.email.id}
            label={formdata.email.label}
            autoComplete={formdata.email.id}
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
