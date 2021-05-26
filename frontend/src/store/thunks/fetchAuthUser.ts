import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { AUTH_USER_PATH } from 'config/api';
import { User } from 'models/User';
import { authApiClient } from './utils/api';
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
    const response = await authApiClient.get(AUTH_USER_PATH);
    return response?.data as FetchAuthUserResponse;
  } catch (e) {
    const error: AxiosError = e;
    return thunkApi.rejectWithValue({
      error: { data: error?.response?.data },
    });
  }
});

export default fetchAuthUser;
