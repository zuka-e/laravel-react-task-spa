import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

import { VERIFICATION_NOTIFICATION_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { RejectWithValue } from '../types';

export const sendEmailVerificationLink = createAsyncThunk<
  AxiosResponse['status'],
  void,
  { rejectValue: RejectWithValue }
>('auth/sendVerificationLink', async (_, thunkApi) => {
  try {
    // 正常時は`202`(認証済みの場合`204`)
    const response = await apiClient().post(VERIFICATION_NOTIFICATION_PATH);
    return response.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
    return thunkApi.rejectWithValue({
      error: { message: String(error) },
    });
  }
});
