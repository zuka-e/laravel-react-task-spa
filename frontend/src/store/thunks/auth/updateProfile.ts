import { createAsyncThunk } from '@reduxjs/toolkit';

import { USER_INFO_PATH } from 'config/api';
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
  try {
    await apiClient().put(USER_INFO_PATH, payload);
    return payload; // fulfill時は、requestの値をそのまま`return`
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
