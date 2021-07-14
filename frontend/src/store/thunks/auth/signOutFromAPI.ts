import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { SIGNOUT_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { RejectWithValue } from '../types';

export const signOutFromAPI = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectWithValue }
>('auth/signOutFromAPI', async (_, thunkApi) => {
  try {
    // status(response): ログイン状態によらず`204` 認証切れなら`419`
    await apiClient().post(SIGNOUT_PATH);
  } catch (e) {
    const error: AxiosError = e;
    return thunkApi.rejectWithValue(error.response?.data);
  }
});
