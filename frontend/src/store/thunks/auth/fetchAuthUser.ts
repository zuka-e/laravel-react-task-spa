import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { AUTH_USER_PATH } from 'config/api';
import { User } from 'models/User';
import { apiClient } from 'utils/api';
import { RejectWithValueType } from '.';

export type FetchAuthUserResponse = {
  user: User;
};

export const fetchAuthUser = createAsyncThunk<
  FetchAuthUserResponse,
  void,
  { rejectValue: RejectWithValueType }
>('auth/fetchAuthUser', async (_, thunkApi) => {
  try {
    const response = await apiClient({ intercepted: false }).get(
      AUTH_USER_PATH
    );
    return response?.data;
  } catch (e) {
    const error: AxiosError = e;
    return thunkApi.rejectWithValue(error.response?.data);
  }
});
