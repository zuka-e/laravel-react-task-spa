import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { GET_CSRF_TOKEN_PATH, FORGOT_PASSWORD_PATH } from 'config/api';
import { authApiClient } from './utils/api';
import { RejectWithValueType } from '.';

export type ForgotPasswordResponse = {};

export type ForgotPasswordRequest = {
  email: string;
};

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  { rejectValue: RejectWithValueType }
>('auth/forgotPassword', async (payload, thunkApi) => {
  const { email } = payload;
  try {
    // 正常時は`200`バリデーションエラー時は`422`
    await authApiClient.get(GET_CSRF_TOKEN_PATH);
    await authApiClient.post(FORGOT_PASSWORD_PATH, {
      email,
    });
  } catch (e) {
    const error: AxiosError = e;
    if (error.response?.status === 422) {
      return thunkApi.rejectWithValue({
        error: {
          message: '指定されたメールアドレスは存在しません',
          data: error.response.data,
        },
      });
    }
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

export default forgotPassword;
