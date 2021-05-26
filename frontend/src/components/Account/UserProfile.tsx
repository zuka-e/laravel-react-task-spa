import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Grid, TextField } from '@material-ui/core';
import { User } from '../../models/User';
import { useAppDispatch } from '../../store/hooks';
import { updateProfile } from 'store/thunks';
import AlertMessage from '../../templates/AlertMessge';
import SubmitButton from '../../templates/SubmitButton';
import { isGuest } from '../../utils/auth';

// Input items
type FormData = {
  username: string;
  email: string;
};

// The schema-based form validation with Yup
const schema = yup.object().shape({
  username: yup.string().min(2).max(30),
  email: yup.string().email().max(255),
});

const UserProfile: React.FC<{ user: User }> = (props) => {
  const { user } = props;
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
    if (!data.username) data.username = user.name;
    if (!data.email) data.email = user.email;

    // 全ての項目で変更点がない場合はリクエストを送らない
    if (data.username === user.name && data.email === user.email) {
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
            id='username'
            label='Username'
            autoComplete='username'
            defaultValue={user.name}
            {...register('username')}
            helperText={errors?.username?.message || '8-30 characters'}
            error={!!errors?.username}
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
            defaultValue={user.email}
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
