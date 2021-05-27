import { createAsyncThunk } from '@reduxjs/toolkit';

import { AxiosError } from 'axios';

import { GET_CSRF_TOKEN_PATH, SIGNIN_PATH } from 'config/api';
import { User } from 'models/User';
import { setFlash } from 'store/slices/authSlice';
import { authApiClient } from './utils/api';
import { fetchAuthUser } from './fetchAuthUser';
import { RejectWithValueType } from '.';

export type SignInResponse = {
  user: User;
  verified: true | undefined;
};

export type SignInRequest = {
  email: string;
  password: string;
  remember?: string;
};

export const signInWithEmail = createAsyncThunk<
  SignInResponse,
  SignInRequest,
  { rejectValue: RejectWithValueType }
>('auth/signInWithEmail', async (payload, thunkApi) => {
  const { email, password, remember } = payload;
  try {
    await authApiClient.get(GET_CSRF_TOKEN_PATH);
    const response = await authApiClient.post(SIGNIN_PATH, {
      email,
      password,
      remember,
    });
    return response?.data;
  } catch (e) {
    const error: AxiosError = e;
    if (error.response?.status === 422) {
      return thunkApi.rejectWithValue({
        error: {
          message: 'メールアドレスまたはパスワードが間違っています',
          data: error.response.data,
        },
      });
    } else if (error.response?.status === 429) {
      return thunkApi.rejectWithValue({
        error: {
          message:
            '所定回数を超えて誤った入力が行われたため、アクセスを制限しております',
          data: error.response.data,
        },
      });
    } // 認証用メールから遷移して、認証リンクが無効だった場合
    else if (error.response?.status === 403) {
      thunkApi.dispatch(fetchAuthUser());
      thunkApi.dispatch(
        setFlash({ type: 'warning', message: '認証に失敗しました' })
      );
    }
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

export default signInWithEmail;
