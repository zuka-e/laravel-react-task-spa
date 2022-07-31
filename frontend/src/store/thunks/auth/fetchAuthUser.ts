import { createAsyncThunk } from '@reduxjs/toolkit';

import { USER_INFO_PATH } from 'config/api';
import { User } from 'models/User';
import { apiClient } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

export type FetchAuthUserResponse = {
  user: User;
};

export const fetchAuthUser = createAsyncThunk<
  FetchAuthUserResponse,
  void,
  AsyncThunkConfig
>('auth/fetchAuthUser', async (_, thunkApi) => {
  try {
    const response = await apiClient({ intercepted: false }).get(
      USER_INFO_PATH
    );
    return response?.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
