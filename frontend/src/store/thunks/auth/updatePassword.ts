import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { UPDATE_PASSWORD_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { RejectWithValue } from '../types';

export type UpdatePasswordRequest = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export const updatePassword = createAsyncThunk<
  void,
  { current_password: string; password: string; password_confirmation: string },
  { rejectValue: RejectWithValue }
>('auth/updatePassword', async (payload, thunkApi) => {
  const { current_password, password, password_confirmation } = payload;
  try {
    await apiClient().put(UPDATE_PASSWORD_PATH, {
      current_password,
      password,
      password_confirmation,
    });
  } catch (e) {
    const error: AxiosError = e;
    if (error.response?.status === 422) {
      return thunkApi.rejectWithValue({
        error: { message: 'パスワードが間違っています' },
      });
    }
    return thunkApi.rejectWithValue(error.response?.data);
  }
});
