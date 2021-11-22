import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { GET_CSRF_TOKEN_PATH, RESET_PASSWORD_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { RejectWithValue } from '../types';

export type ResetPasswordResponse = {};

export type ResetPasswordRequest = {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
};

export const resetPassword = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordRequest,
  { rejectValue: RejectWithValue }
>('auth/resetPassword', async (payload, thunkApi) => {
  const { email, password, password_confirmation, token } = payload;
  try {
    // 正常時は`200`バリデーションエラー時は`422`
    await apiClient({ apiRoute: false }).get(GET_CSRF_TOKEN_PATH);
    await apiClient().post(RESET_PASSWORD_PATH, {
      email,
      password,
      password_confirmation,
      token,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422)
      return thunkApi.rejectWithValue({
        error: { message: '認証に失敗しました\n再度お試しください' },
      });
    return thunkApi.rejectWithValue({
      error: { message: String(error) },
    });
  }
});
