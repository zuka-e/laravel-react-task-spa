import { createAsyncThunk } from '@reduxjs/toolkit';

import { GET_CSRF_TOKEN_PATH, SIGNIN_PATH } from 'config/api';
import { User } from 'models/User';
import { apiClient } from 'utils/api';
import { isHttpException } from 'utils/api/errors';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';
import { fetchAuthUser } from './fetchAuthUser';

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
  AsyncThunkConfig
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
    // 認証用メールから遷移して、認証リンクが無効だった場合
    if (isHttpException(error) && error.response.status === 403) {
      const { setFlash } = await import('store/slices/authSlice');
      thunkApi.dispatch(fetchAuthUser());
      thunkApi.dispatch(
        setFlash({ type: 'warning', message: '認証に失敗しました' })
      );
    }
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
