import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { GET_CSRF_TOKEN_PATH, SIGNIN_PATH } from 'config/api';
import { User } from 'models/User';
import { apiClient } from 'utils/api';
import { fetchAuthUser } from './fetchAuthUser';
import { RejectWithValue } from '../types';

export type SignInResponse = {
  user: User;
  verified?: true;
};

export type SignInRequest = {
  email: string;
  password: string;
  remember?: string;
};

export const signInWithEmail = createAsyncThunk<
  SignInResponse,
  SignInRequest,
  { rejectValue: RejectWithValue }
>('auth/signInWithEmail', async (payload, thunkApi) => {
  const { email, password, remember } = payload;
  try {
    await apiClient({ apiRoute: false }).get(GET_CSRF_TOKEN_PATH);
    const response = await apiClient().post(SIGNIN_PATH, {
      email,
      password,
      remember,
    });
    return response?.data;
  } catch (error) {
    if (!axios.isAxiosError(error))
      return thunkApi.rejectWithValue({
        error: { message: String(error) },
      });

    switch (error.response?.status) {
      case 403: // 認証用メールから遷移して、認証リンクが無効だった場合
        const { setFlash } = await import('store/slices/authSlice');
        thunkApi.dispatch(fetchAuthUser());
        thunkApi.dispatch(
          setFlash({ type: 'warning', message: '認証に失敗しました' })
        );
        break;
      case 422:
        return thunkApi.rejectWithValue({
          error: { message: 'メールアドレスまたはパスワードが間違っています' },
        });
      case 429:
        return thunkApi.rejectWithValue({
          error: {
            message:
              '所定回数を超えて誤った入力が行われたため、アクセスを制限しております',
          },
        });
      default:
        return thunkApi.rejectWithValue(error.response?.data);
    }
  }
});
