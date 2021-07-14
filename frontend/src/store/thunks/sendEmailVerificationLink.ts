import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';

import { VERIFICATION_NOTIFICATION_PATH } from 'config/api';
import { apiClient } from 'utils/api';

export const sendEmailVerificationLink = createAsyncThunk<
  AxiosResponse['status'],
  void
>('auth/sendVerificationLink', async (_, thunkApi) => {
  try {
    // 正常時は`202`(認証済みの場合`204`)
    const response = await apiClient().post(VERIFICATION_NOTIFICATION_PATH);
    return response.status;
  } catch (e) {
    const error: AxiosError = e;
    return thunkApi.rejectWithValue(error.response?.data);
  }
});
