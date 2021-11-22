import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { GET_CSRF_TOKEN_PATH, FORGOT_PASSWORD_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { RejectWithValue } from '../types';

export type ForgotPasswordResponse = {};

export type ForgotPasswordRequest = {
  email: string;
};

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  { rejectValue: RejectWithValue }
>('auth/forgotPassword', async (payload, thunkApi) => {
  const { email } = payload;
  try {
    // 正常時は`200`バリデーションエラー時は`422`
    await apiClient({ apiRoute: false }).get(GET_CSRF_TOKEN_PATH);
    await apiClient().post(FORGOT_PASSWORD_PATH, { email });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422)
      return thunkApi.rejectWithValue({
        error: { message: '指定されたメールアドレスは存在しません' },
      });
    return thunkApi.rejectWithValue({
      error: { message: String(error) },
    });
  }
});
