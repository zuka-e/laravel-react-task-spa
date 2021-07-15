import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Grid, TextField } from '@material-ui/core';

import { updateProfile } from 'store/thunks/auth';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { isGuest } from 'utils/auth';
import { AlertMessage, SubmitButton } from 'templates';

// Input items
type FormData = {
  name: string;
  email: string;
};

// The schema-based form validation with Yup
const schema = yup.object().shape({
  name: yup.string().min(2).max(30),
  email: yup.string().email().max(255),
});

const UserProfile = () => {
  // ページが表示されている場合
  // `signedIn`=== `true` -> `user` !== `null` -> `user!`
  const user = {
    name: useAppSelector((state) => state.auth.user!.name),
    email: useAppSelector((state) => state.auth.user!.email),
  };
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string | undefined>('');
  const {
    register, // 入力項目の登録
    handleSubmit, // 用意された`handleSubmit`
    formState: { errors }, // エラー情報 (メッセージなど)
  } = useForm<FormData>({
    mode: 'onBlur', // バリデーション判定タイミング
    resolver: yupResolver(schema),
  });

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
    if (updateProfile.rejected.match(response)) {
      setMessage(response.payload?.error?.message);
    } else setMessage('');
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
            id='name'
            label='Username'
            autoComplete='name'
            defaultValue={user?.name}
            {...register('name')}
            helperText={errors?.name?.message || '8-30 characters'}
            error={!!errors?.name}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            disabled={isGuest()}
            variant='outlined'
            margin='normal'
            fullWidth
            id='email'
            label='Email Address'
            autoComplete='email'
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
