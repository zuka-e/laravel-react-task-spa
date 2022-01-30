import { createAsyncThunk } from '@reduxjs/toolkit';

import { GET_CSRF_TOKEN_PATH, RESET_PASSWORD_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

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
  AsyncThunkConfig
>('auth/resetPassword', async (payload, thunkApi) => {
  try {
    // 正常時は`200`バリデーションエラー時は`422`
    await apiClient({ apiRoute: false }).get(GET_CSRF_TOKEN_PATH);
    await apiClient().post(RESET_PASSWORD_PATH, payload);
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
