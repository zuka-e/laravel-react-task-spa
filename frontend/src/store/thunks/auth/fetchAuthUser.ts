import { createAsyncThunk } from '@reduxjs/toolkit';

import { AUTH_USER_PATH } from 'config/api';
import { User } from 'models/User';
import { apiClient } from 'utils/api';
import { isHttpException } from 'utils/api/errors';
import { RejectWithValue } from '../types';

export type FetchAuthUserResponse = {
  user: User;
};

export const fetchAuthUser = createAsyncThunk<
  FetchAuthUserResponse,
  void,
  { rejectValue: RejectWithValue }
>('auth/fetchAuthUser', async (_, thunkApi) => {
  try {
    const response = await apiClient({ intercepted: false }).get(
      AUTH_USER_PATH
    );
    return response?.data;
  } catch (error) {
    if (isHttpException(error))
      return thunkApi.rejectWithValue({
        error: {
          message: `${error.response.status}: ${error.response.data.message}`,
        },
      });
    return thunkApi.rejectWithValue({
      error: { message: String(error) },
    });
  }
});
