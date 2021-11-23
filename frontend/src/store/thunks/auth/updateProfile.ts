import { createAsyncThunk } from '@reduxjs/toolkit';

import { UPDATE_USER_INFO_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

export type UpdateProfileResponse = {
  name: string;
  email: string;
};

export type UpdateProfileRequest = {
  name: string;
  email: string;
};

export const updateProfile = createAsyncThunk<
  UpdateProfileResponse,
  UpdateProfileRequest,
  AsyncThunkConfig
>('auth/updateProfile', async (payload, thunkApi) => {
  const { name, email } = payload;
  try {
    await apiClient().put(UPDATE_USER_INFO_PATH, { name, email });
    return { name, email }; // fulfill時は、requestの値をそのまま`return`
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
